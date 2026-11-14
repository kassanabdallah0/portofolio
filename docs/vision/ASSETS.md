# Vision asset provenance

License review: 14 November 2026. Assets are locally hosted; no CDN or paid API.

## Electric counterbalance forklift

- Author/source: Innerscene Corp, [original model listing](https://www.innerscene.com/tools/library/3d-parts/electric-counterbalance-forklift-7acc0547).
- License: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). The listing explicitly permits use, modification and redistribution; the source GLB embeds the same dedication and author.
- Original `forklift-original.glb`: 706,388 bytes; SHA-256 `2233d072b7aba870c9a41bfb36782116195d3e14e7e05ef2348bbb44a278e326`.
- Delivered `public/engineering/assets/forklift.glb`: 741,912 bytes; SHA-256 `3d8b4650046a9fecad8e62e325777238455013ca945e1b8e0a818cc7e55c78ff`.
- 18,460 triangles; 81 original mesh pieces consolidated into 14 material draws while preserving wheel and carriage pivots. Conversion adds index/normal data, so the optimized rendering structure is slightly larger on disk.
- Dimensions: approximately 1.22 m wide, 3.4 m long, 2.305 m high. Forward is +Z, tyre contact Y=0. Front/rear wheel radii are 0.28/0.215 m.

The model has a counterweight, wheel hubs, overhead guard, mast rails, chains,
hydraulic details, controls, seat and fork carriage. Runtime wheel rotation follows
signed travel and carriage travel follows the supplied lift value. It is a nominal
visualization model, not manufacturer CAD or a certified operating-clearance model.
The straight loading lane avoids making unsupported claims about its turning radius.
`prepare-forklift.mjs` reproduces the conversion using the existing Three.js tools.

## Workers and driver

The existing Quaternius CC0 rigged worker is reused without changing the shared
model or asset. Source, hashes and license are recorded in
[the existing asset record](../engineering-showcase/ASSETS.md).
Three workshop workers use authored walking/idle/interaction clips. The forklift
driver uses an independently cloned skeleton and a locally authored seated pose;
it is not described as a source-provided driving animation. Bone resources are
released per instance; shared mesh/material data stays cached.

The worker remains stylized and faceted. It has no foot-contact IK or separately
authored turn clip. Distance-driven gait, smooth authored clip blending and gentle
route curvature reduce sliding; they do not constitute motion-capture realism.

## Original code-native assets

The workshop, CNC enclosure/interior, shelving, pallets, safety markings, structural
frame, cable, camera mount, edge station and beacon are original technical
reconstructions. Camera and Jetson geometry reuse the portfolio's existing models.
They are not imported industrial CAD. Concrete grain is a deterministic generated
texture; no external bitmap or production camera footage is used.

Actual Chrome asset-review frames were inspected from the front and rear: the
forklift proportions, guard clearance, seated driver's hands/feet and wheel contact
are visible. Full-scene screenshots and browser observations are in VERIFICATION.md.
