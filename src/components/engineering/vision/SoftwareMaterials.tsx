'use client';
import { useLayoutEffect, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
/** Preserve authored geometry/colors on software GPUs with vertex-lit materials.
 * Overrides belong to this scene instance; cached asset materials are untouched.
 */
export function useSoftwareMaterials(
  root: RefObject<THREE.Group | null>,
  enabled?: boolean,
) {
  const { gl } = useThree();
  const pairs = useRef<
    {
      source: THREE.MeshStandardMaterial;
      material: THREE.MeshLambertMaterial;
    }[]
  >([]);
  useLayoutEffect(() => {
    if (!enabled || !root.current) return;
    const cache = new Map<THREE.Material, THREE.Material>();
    const originals: {
      mesh: THREE.Mesh;
      material: THREE.Material | THREE.Material[];
    }[] = [];
    const convert = (source: THREE.Material) => {
      if (!(source instanceof THREE.MeshStandardMaterial)) return source;
      const found = cache.get(source);
      if (found) return found;
      const material = new THREE.MeshLambertMaterial({
        color: source.color,
        map: source.map,
        alphaMap: source.alphaMap,
        opacity: source.opacity,
        transparent: source.transparent,
        side: source.side,
        vertexColors: source.vertexColors,
        depthWrite: source.depthWrite,
        emissive: source.emissive,
        emissiveMap: source.emissiveMap,
      });
      // Keep the zone and beacon's live color objects synchronized.
      material.color = source.color;
      material.emissive = source.emissive;
      pairs.current.push({ source, material });
      cache.set(source, material);
      return material;
    };
    root.current.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      originals.push({ mesh: object, material: object.material });
      object.material = Array.isArray(object.material)
        ? object.material.map(convert)
        : convert(object.material);
    });
    gl.domElement.setAttribute('data-vertex-lit', String(pairs.current.length));
    return () => {
      originals.forEach(({ mesh, material }) => {
        mesh.material = material;
      });
      pairs.current.forEach(({ material }) => material.dispose());
      pairs.current = [];
    };
  }, [root, enabled, gl]);
  useFrame(() => {
    pairs.current.forEach(({ source, material }) => {
      material.emissiveIntensity = source.emissiveIntensity;
    });
  }, -1);
  return null;
}
