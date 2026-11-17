import * as THREE from 'three';

/** Deduplicate only skeletons belonging to an already-cloned character instance.
 * Mesh bind matrices remain untouched. Shared bones and identical inverse binds
 * make their skinning matrices equivalent, so one bone texture can serve every
 * material/mesh part of that character. Never call this on the useLoader cache.
 */
export function shareIdenticalSkeletons(root: THREE.Object3D) {
  const skeletons: THREE.Skeleton[] = [];
  const duplicates = new Set<THREE.Skeleton>();
  root.traverse((object) => {
    if (!(object instanceof THREE.SkinnedMesh)) return;
    const candidate = object.skeleton;
    const shared = skeletons.find(
      (skeleton) =>
        skeleton === candidate ||
        (skeleton.bones.length === candidate.bones.length &&
          skeleton.boneInverses.length === candidate.boneInverses.length &&
          skeleton.bones.every(
            (bone, index) => bone === candidate.bones[index],
          ) &&
          skeleton.boneInverses.every((inverse, index) =>
            inverse.elements.every(
              (value, element) =>
                value === candidate.boneInverses[index].elements[element],
            ),
          )),
    );
    if (!shared) {
      skeletons.push(candidate);
    } else if (shared !== candidate) {
      object.skeleton = shared;
      duplicates.add(candidate);
    }
  });
  // The unused duplicates are owned by this clone, never by another actor.
  // Normally no GPU texture exists yet; dispose one only if it was initialized.
  duplicates.forEach((skeleton) => {
    if (skeleton.boneTexture) skeleton.dispose();
  });
}
