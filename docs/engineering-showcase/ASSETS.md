# Engineering showcase: asset provenance and review

Verified on 7 November 2026. Both distributed assets are CC0; they are served from the repository, with no runtime CDN or third-party API. Attribution is included voluntarily. This page distinguishes imported artist-authored models from the site's procedural equipment and environments.

## Rigged industrial worker

- **Artist:** Quaternius.
- **Primary listing and license:** [Worker on the artist's Poly Pizza profile](https://poly.pizza/m/Yg2bQZO6Hj), explicitly marked Public Domain (CC0).
- **Additional author provenance:** [Ultimate Animated Character Pack](https://quaternius.com/packs/ultimatedanimatedcharacter), whose author page identifies the pack as CC0.
- **Downloaded source:** [Original animated GLB](https://static.poly.pizza/3a5f3056-ffe6-42eb-bd52-122afcbd22b2.glb).
- **License:** [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/).
- **Source SHA-256:** `9c28614f465b7dc105f908c20c22fc045f4b07caf8c5ef0e9f8049eceb6dd38d`.
- **Delivered:** `public/engineering/assets/worker-rigged.glb`, 811,968 bytes, 5,240 triangles, 13 material primitives, 11 materials, no texture downloads.
- **Delivered SHA-256:** `e4c91545d67ce0d9bd576a8d72b7ac5b724e91a5821958e88fa02cc92b145843`.

The original asset contains authored body topology, a skeleton, skin weights, face, clothing, boots, a fitted hardhat, and a safety vest. The delivered model retains the authored **walk, idle and interact** clips; 21 unrelated clips were removed. Export creates 13 skinned material primitives referencing the rig. The model is 1.834 m tall before application scaling.

`RiggedWorker.tsx` clones the skeleton for each character while reusing cached geometry, blends clip weights, and derives gait phase from cumulative path distance. The authored planted-foot travel corresponds to approximately 1.72 m per complete walk cycle at original height; stride scales with character height. The scene owns the position, heading and clock, allowing the body to stop and turn with the story instead of drifting independently. Per-instance vest colors are separate materials; cloned skeleton resources and material overrides are released on unmount.

**Aesthetic limit:** this is a professionally authored, stylized low-poly human, not a photorealistic scan or motion-captured actor. The face and garment surfaces are visibly faceted. Its real rig and anatomical topology replace the previous capsule-and-box character. Turning is path-driven heading, while walk/idle/interact poses use the authored skeleton. The project does not claim a separately authored turn clip or fully solved foot-contact IK.

## Coach / connected fleet

- **Artist:** ajanhallinta.
- **Primary author listing and license:** [3D Bus on OpenGameArt](https://opengameart.org/content/3d-bus), explicitly published by the artist under CC0.
- **Downloaded source archive:** [3DBus_by_ajanhallinta.zip](https://opengameart.org/sites/default/files/3DBus_by_ajanhallinta.zip), containing original Blender, FBX, OBJ and README files.
- **License:** [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/). The archive's README also explicitly states CC0.
- **Source archive SHA-256:** `88c6c178a7334263bac319b6a20531c7911e65e566a39dd1797044485d0f75f1`.
- **Source `FBX/BUS.fbx` SHA-256:** `123c44e0354ff8886fd663be03f995cd2a8f925edf8e4d00b820162c10d3aa25`.
- **Delivered:** `public/engineering/assets/transit-bus.glb`, 452,100 bytes, 14,455 triangles, 5 authored mesh assemblies, 18 material primitives, 9 materials, no texture downloads.
- **Delivered SHA-256:** `093858e949b6366839c541afeb280bc767c7e5ad27510e5adc9d07ca24991c99`.

This Blender-authored coach includes a curved front and windscreen, modeled wheel arches, luggage compartment panels, passenger doors, window frames, lights, bumpers and detailed wheel hubs. The mesh is not a box with independently attached window rectangles. The original file is converted from FBX to GLB, centered, grounded and oriented with +Z forward. Length is normalized to 12 m, width approximately 2.66 m and height 2.954 m. Each wheel has a real pivot and an approximately 0.448 m radius; runtime rotation follows traveled distance, including when the parent scales the bus into a miniature scene.

The conversion welds identical vertices and groups opaque triangles by material, reducing **521 FBX material runs to 18 material primitives** without removing the authored geometric details. This figure is one main rendering pass; shadows can add draw calls. Legacy materials are converted to restrained PBR metal, rubber, glass and paint. The runtime clones only livery materials, shares cached geometry, and releases its overrides on unmount.

**Representation limit:** the generic coach represents the connected fleet; it is not a CAD reconstruction of a particular operator's bus. The original model has no passenger interior, working doors or powertrain. Router inspection is therefore a dedicated equipment view, rather than a claim that the source asset contains a modeled interior.

## Alternatives inspected and rejected

- [Innerscene low-floor city bus](https://www.innerscene.com/tools/library/3d-parts/low-floor-city-bus-9e7ce899): CC0 was verified and the GLB rendered, but its slab-like body did not meet the primary-model visual goal. **Not included in the delivered assets.**
- [Innerscene Drew construction worker](https://www.innerscene.com/tools/library/3d-parts/drew-3d-person-construction-worker-with-hard-hat-and-hi-vis-a4aa98af): the source page identifies its MakeHuman-based construction and CC0 license. Inspection of the 23.9 MB GLB found **no skin or animation data**; a static posed mesh could not satisfy the animation requirement. **Not included.**

No paid assets, access-restricted downloads, logo textures or third-party production footage are included.

## Reproduction and visual review

`prepare-assets.mjs` is an offline build tool using the already installed Three.js utilities. Place the downloaded worker at `worker.glb`, extract the bus archive into `bus-oga/`, then run from the repository root:

```sh
node docs/engineering-showcase/prepare-assets.mjs /path/to/source-assets
```

The tool writes only the two runtime GLBs. It adds no dependency and needs no Blender installation; the artist's original Blender model is preserved in the downloadable source archive. Geometry compression was deliberately avoided: both assets together are about **1.27 MB**, have no textures, and load through the existing GLTFLoader without decoder bundles.

The assets were rendered locally in Chrome/Three.js with actual skeletal poses and studio lighting. Review images cover idle, mid-walk and equipment interaction. The final coach replaced the first candidate after actual rendered review. These isolated asset checks verify recognizable proportions, grounded tires, authored wheel geometry, readable clothing and skeletal movement; the parent scenes still require their own composition, animation lifecycle and mobile verification.

- [Idle and coach geometry](assets-idle.png)
- [Mid-walk pose](assets-walk.png)
- [Interaction pose](assets-interact.png)
