/** Repackage verified CC0 source GLBs; no network or runtime dependency required.
 * Usage: node docs/engineering-showcase/prepare-assets.mjs /tmp/engineering-assets
 * Input: worker.glb (Quaternius), bus-oga/FBX/BUS.fbx (ajanhallinta). See ASSETS.md.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

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
const input = process.argv[2];
if (!input)
  throw new Error('Pass the folder containing the verified source GLBs.');
async function load(name) {
  const bytes = readFileSync(resolve(input, `${name}.glb`));
  return new GLTFLoader().parseAsync(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    '',
  );
}
async function save(scene, name, animations = []) {
  const bytes = await new GLTFExporter().parseAsync(scene, {
    binary: true,
    animations,
    onlyVisible: false,
  });
  const destination = resolve('public/engineering/assets', `${name}.glb`);
  writeFileSync(destination, Buffer.from(bytes));
  console.log(name, bytes.byteLength, 'bytes');
}
const worker = await load('worker');
const clips = worker.animations.filter((clip) =>
  /\|(Walk|Idle|Interact)$/.test(clip.name),
);
clips.forEach((clip) => {
  clip.name = clip.name.split('|')[1].toLowerCase();
  clip.optimize();
});
await save(worker.scene, 'worker-rigged', clips);

const bytes = readFileSync(resolve(input, 'bus-oga/FBX/BUS.fbx'));
const bus = new FBXLoader().parse(
  bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
  '',
);
bus.updateMatrixWorld(true);
const sourceBox = new THREE.Box3().setFromObject(bus);
const scale = 12 / (sourceBox.max.x - sourceBox.min.x);
const center = sourceBox.getCenter(new THREE.Vector3());
const transform = new THREE.Matrix4()
  .makeScale(scale, scale, scale)
  .multiply(new THREE.Matrix4().makeRotationY(-Math.PI / 2))
  .multiply(
    new THREE.Matrix4().makeTranslation(-center.x, -sourceBox.min.y, -center.z),
  );
const result = new THREE.Group();
result.name = 'TransitBus';
const palette = new Map();
function pbr(material) {
  if (palette.has(material.name)) return palette.get(material.name);
  const paint = new THREE.MeshStandardMaterial({
    name: material.name,
    color: material.color,
    roughness: 0.4,
    metalness: 0.12,
  });
  if (material.name === 'Body') {
    paint.name = 'blue';
    paint.color.set('#d5e0e6');
    paint.metalness = 0.3;
    paint.roughness = 0.32;
  }
  if (material.name === 'Windows') {
    paint.color.set('#183847');
    paint.metalness = 0.4;
    paint.roughness = 0.16;
  }
  if (material.name === 'Tire') {
    paint.color.set('#20282b');
    paint.metalness = 0;
    paint.roughness = 0.86;
  }
  if (material.name === 'Metal') {
    paint.color.set('#b7c5cc');
    paint.metalness = 0.8;
    paint.roughness = 0.28;
  }
  if (material.name === 'FrontLights') {
    paint.color.set('#e3eff6');
    paint.emissive.set('#d4e5ef');
    paint.emissiveIntensity = 0.3;
  }
  palette.set(material.name, paint);
  return paint;
}
// FBX stores hundreds of alternating material runs. Reorder opaque indices by
// material before export: this reduces 521 primitive draws to 18 without loss.
function optimizedGeometry(source) {
  const geometry = mergeVertices(source, 0.00001);
  const index = geometry.getIndex();
  const grouped = new Map();
  for (const group of geometry.groups) {
    if (!grouped.has(group.materialIndex)) grouped.set(group.materialIndex, []);
    const values = grouped.get(group.materialIndex);
    for (let i = group.start; i < group.start + group.count; i++)
      values.push(index.getX(i));
  }
  if (!grouped.size) return geometry;
  geometry.clearGroups();
  const sorted = [];
  for (const [material, values] of grouped) {
    geometry.addGroup(sorted.length, values.length, material);
    sorted.push(...values);
  }
  geometry.setIndex(sorted);
  return geometry;
}
let wheelIndex = 0;
bus.traverse((node) => {
  if (!node.isMesh) return;
  const geometry = node.geometry
    .clone()
    .applyMatrix4(node.matrixWorld)
    .applyMatrix4(transform);
  const materials = Array.isArray(node.material)
    ? node.material.map(pbr)
    : pbr(node.material);
  if (/wheel/i.test(node.name)) {
    geometry.computeBoundingBox();
    const pivot = geometry.boundingBox.getCenter(new THREE.Vector3());
    geometry.translate(-pivot.x, -pivot.y, -pivot.z);
    const wheel = new THREE.Group();
    wheel.name = `wheel-${wheelIndex++}`;
    wheel.position.copy(pivot);
    const mesh = new THREE.Mesh(optimizedGeometry(geometry), materials);
    wheel.add(mesh);
    result.add(wheel);
  } else {
    const mesh = new THREE.Mesh(optimizedGeometry(geometry), materials);
    mesh.name = 'Coach body';
    result.add(mesh);
  }
});
await save(result, 'transit-bus');
