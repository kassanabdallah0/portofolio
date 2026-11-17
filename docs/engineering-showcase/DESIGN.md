# Engineering exhibition — design foundation

The Liquid Glass shell stays intact. The exhibition replaces the independently
clocked primitive scenes with six distinct, locally simulated engineering stories.
Reference: the unchanged four-page CV in `public/bucket`.

## Art direction

- **COLAS:** a warm, pearl industrial demonstration bay. A human-scale kiosk,
  camera and embedded computer are the composition; a rigged PPE worker approaches,
  stops, scans and leaves. The screen is a real texture on the display surface.
- **MediaSpot:** a designed miniature transport district with continuous bus routes.
  Physical fleet, selected router detail and cloud architecture have distinct scales.
- **Vision:** a steel-blue industrial workcell with a visible monitored region.
  Projected tracking follows the worker; temporal evidence precedes an alert.
- **Manager:** a usable industrial desktop application, with camera ROI manipulation.
- **Delivery:** product-scale embedded hardware beside a controlled release console.
- **ELK:** an infrastructure/operations view, including three nodes and index retention.

Use graphite, enamel white, brushed aluminium, blue glass, rubber and concrete.
Safety amber belongs to physical markings; green indicates confirmed state.
Large soft key lighting, hemisphere fill and restrained environment reflections
replace saturated point-light glow. Orthographic/long-lens views preserve technical
legibility. Camera changes are damped, never abrupt cuts during normal playback.

## Animation and domain contracts

One persistent simulation time ref owns each exhibit. Visibility, modal obscuring,
pause and reduced motion gate that clock. Rendering reads it; it does not start
an unrelated timer. Closed paths preserve position and heading across loop boundaries.
Scan approach/stabilization/acquisition/validation/result/departure share one timeline.
Explicit replay is a user-requested restart, not the normal loop.

Vision's approximately 5→30 FPS is processing throughput; COLAS's 2–3→10 FPS
is display cadence (15–20 in experiments). Comparisons are illustrations, never
browser benchmarks. VPN infrastructure traffic is distinct from application access.
CI prepares an image; a local command activates it. ELK volumes are historical.

## Assets and performance

Use verified, locally hosted licensed assets when they improve primary geometry.
Record provenance, adaptations and limitations in ASSETS.md. Shared meshes/materials
and cache-friendly GLBs avoid duplicating downloads. Custom hardware is a documented
technical reconstruction, not manufacturer CAD.

Target one canvas per visible physical exhibit, zero canvases for reduced-motion,
mobile and unavailable-WebGL alternatives. Only the dialog's exhibit runs when it is
open. Offscreen canvases unmount; the simulation clock survives. DPR is capped at 1.5,
one shadow map per physical scene at 1024², no postprocessing or new animation engine.
Use compressed-size-conscious meshes and modest texture resolution; record actual
asset sizes and rendered observations after integration. R3F disposes local resources;
cached GLB resources remain shared intentionally. Canvas textures dispose on unmount.

## Verification

Keep existing test coverage and CV hashes. Add causal timeline, continuous-path,
selection, comparison and ROI checks. Capture real WebGL initial/intermediate/result
and detail views, mobile fallbacks, dialogs and representative portfolio sections.
Review images, not just successful screenshots. Work stays on
`feat/professional-engineering-showcase` and PR #7; no main merge or deployment.
