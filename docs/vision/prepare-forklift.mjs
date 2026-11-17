/** Offline conversion of the verified CC0 forklift. See ASSETS.md.
 * node docs/vision/prepare-forklift.mjs /path/to/forklift-source.glb
 * Uses existing Three.js only; no Blender, CDN or compression decoder required.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import {
  mergeGeometries,
  mergeVertices,
} from 'three/examples/jsm/utils/BufferGeometryUtils.js';

globalThis.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = buffer;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = `data:${blob.type};base64,${Buffer.from(buffer).toString('base64')}`;
      this.onloadend?.();
    });
  }
};
if (!process.argv[2]) throw new Error('Provide the licensed source GLB path.');
const bytes = readFileSync(process.argv[2]);
const gltf = await new GLTFLoader().parseAsync(
  bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
  '',
);
gltf.scene.updateMatrixWorld(true);
const forklift = new THREE.Group();
forklift.name = 'VisionForklift';
const staticParts = new Map(),
  carriageParts = new Map();
const wheelParts = Array.from({ length: 4 }, () => new Map());
const pivots = [
  [-0.55, 0.28, 0.53],
  [0.55, 0.28, 0.53],
  [-0.47, 0.215, -0.67],
  [0.47, 0.215, -0.67],
];
const metal = new THREE.MeshStandardMaterial({
  name: 'wheel-metal',
  color: '#87959c',
  metalness: 0.78,
  roughness: 0.31,
});
const palette = new Map();
function materialFor(source) {
  if (palette.has(source.name)) return palette.get(source.name);
  const material = source.clone();
  if (source.name === 'orange') {
    material.color.set('#c59845');
    material.metalness = 0.18;
    material.roughness = 0.36;
  }
  if (source.name === 'steel') {
    material.color.set('#45545d');
    material.metalness = 0.72;
    material.roughness = 0.36;
  }
  if (source.name === 'black') {
    material.color.set('#232d31');
    material.metalness = 0.03;
    material.roughness = 0.77;
  }
  if (source.name === 'rubber') {
    material.color.set('#202629');
    material.metalness = 0;
    material.roughness = 0.88;
  }
  material.side = THREE.FrontSide;
  palette.set(source.name, material);
  return material;
}
gltf.scene.traverse((object) => {
  if (!object.isMesh) return;
  const geometry = object.geometry.clone().applyMatrix4(object.matrixWorld);
  let material = materialFor(object.material),
    bucket = staticParts;
  if (/^(Drive|Steering)[ _]wheel_/.test(object.name)) {
    geometry.computeBoundingBox();
    const center = geometry.boundingBox.getCenter(new THREE.Vector3());
    const index = (center.x > 0 ? 1 : 0) + (center.z < 0 ? 2 : 0);
    const [x, y, z] = pivots[index];
    geometry.translate(-x, -y, -z);
    bucket = wheelParts[index];
    if (material.name !== 'rubber') material = metal;
  } else if (/^(Carriage|Fork[ _]blade|Fork[ _]upright)/.test(object.name)) {
    bucket = carriageParts;
  }
  if (!bucket.has(material)) bucket.set(material, []);
  bucket.get(material).push(geometry);
});
function addMerged(parent, buckets) {
  for (const [material, geometries] of buckets) {
    const merged = mergeGeometries(geometries, false);
    if (!merged) throw new Error('Forklift geometry attributes differ.');
    const mesh = new THREE.Mesh(mergeVertices(merged, 1e-5), material);
    mesh.name = material.name;
    parent.add(mesh);
  }
}
if (wheelParts.some((parts) => parts.size === 0) || carriageParts.size === 0) {
  throw new Error(
    'Source wheel/carriage names changed; refusing a static vehicle.',
  );
}
addMerged(forklift, staticParts);
const carriage = new THREE.Group();
carriage.name = 'fork-carriage';
addMerged(carriage, carriageParts);
forklift.add(carriage);
wheelParts.forEach((parts, index) => {
  const steer = new THREE.Group();
  steer.name = `fork-steer-${index}`;
  steer.position.fromArray(pivots[index]);
  const wheel = new THREE.Group();
  wheel.name = `fork-wheel-${index}`;
  addMerged(wheel, parts);
  steer.add(wheel);
  forklift.add(steer);
});
const output = await new GLTFExporter().parseAsync(forklift, { binary: true });
writeFileSync('public/engineering/assets/forklift.glb', Buffer.from(output));
console.log('forklift.glb', output.byteLength, 'bytes');
