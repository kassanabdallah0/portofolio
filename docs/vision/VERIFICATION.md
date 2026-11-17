# SecuriSPOT Vision verification

The implementation and browser review cover SecuriSPOT Vision on
`feat/professional-engineering-showcase`, PR #7. No merge or production deployment
is part of this change. The other five exhibits, Liquid Glass shell, project data,
case-study routes and CV retain their existing visual/content design.

## Automated checks

Environment: Node 20.19.4, Next.js static export, Chrome.

| Gate | Result |
| --- | --- |
| ESLint | Passed |
| TypeScript / production static build | Passed |
| Affected desktop startup, motion, camera and context-disposal regressions | 10 passed on two CPU cores, original timeouts |
| Unsupported WebGL fallback | Existing regression passed (3.0 s) |
| Complete CI workflow | [Current PR #7 checks](https://github.com/kassanabdallah0/portofolio/pull/7/checks) |
| Actual rendered cycle and screenshots | 26 reviewed captures; no page errors or horizontal overflow in capture reports |

The [workflow for `22c1dcd`](https://github.com/kassanabdallah0/portofolio/actions/runs/44187567955)
reported 81 passes, 6 retry passes, 2 failures and 9 intentional skips. Its traces
showed multi-second gaps in browser responses, including a Manager dialog with no
Canvas. That dialog reached the correct completed state after the assertion timed
out. A controlled two-core run using CPU page compositing passed all ten targeted
cases while retaining real SwiftShader WebGL, actual pause/projection checks and
held-context disposal assertions.

The test browser now uses `--disable-gpu-compositing` alongside the existing
SwiftShader flags. This changes page compositing, not WebGL availability; Chromium
supports [software page rendering with SwiftShader WebGL](https://chromium.googlesource.com/chromium/src/+/main/docs/gpu/swiftshader.md).
The original tests, timeouts, retry policy and skips are preserved. Native GPU
screenshots remain the visual reference, because compositors can differ in filter
edge details.

Hero and Vision create only the context that actually renders the scene; there
are no disposable WebGL feature probes. Renderer metadata is recorded from that
real context before scene content mounts. A failed renderer is handled by the
existing scene boundary and lightweight fallback.

The native IntersectionObserver's latest entry remains authoritative, including
dialog clipping. Vision retains a stable presentation height while its Canvas is
released when obscured or offscreen. The context-disposal test also verifies that
suspension preserves height; original assertions, timeouts and skips are unchanged.
The Projects hash destination settles immediately instead of continuing a native
smooth scroll while exhibit layouts initialize. Other anchors retain their existing
behavior. Dialog close clears the selected project immediately while preserving
hash history and focus restoration.

Vision and Hero use demand rendering on software GPUs, with an 80 ms steady-state
interval and an asynchronous completion fence before the next automatic frame.
Explicit inspection invalidations can render promptly. Vision uses DPR 0.75,
vertex-lit materials and contact shadows. The other software tiers use DPR 1,
disabled real-time shadows and a 64px PBR environment. Scan/Fleet retain their
original frame loop and pause behavior. Hardware appearance is unchanged. These
settings do not represent the 5 → 30 FPS vision-processing improvement.

Only renderer metadata is cached per document; no temporary context is retained.
Unknown Vision renderers receive a short stable-visit delay before startup, with a
live lightweight preview. Known hardware starts sooner. Matching cloned worker
skeletons share their bone data within each Vision actor: 13 skeletons become one,
with zero skinning-position difference across 1,252 sampled vertices. Source assets
and the scan worker's default animation behavior remain unchanged.

`tests/vision.spec.ts` checks:

- Worker path position, heading, velocity and foot travel across independent cycles.
- Forklift forward/stop/lift/reverse joins, wheel travel and cycle continuity.
- Camera projection against an independent Three.js perspective camera.
- Camera observability independently of configured zone membership.
- Evidence preceding confirmation, no early warning, departure clearing the event.
- Stable tracked identity and brief presence producing no confirmed alarm.
- Actual WebGL pause/seek synchronization and projected box placement.
- Reuse of the renderer when switching to camera view.
- Actual context loss after dialog/offscreen disposal, using retained WebGL handles.
- Reduced motion, unsupported WebGL and the shared fallback/controller timeline.

Real-WebGL checks use real time. Fake-clock controller checks explicitly use the
no-WebGL path. The existing CI retry policy is preserved.

## Visual review

[Image index and before/after comparison](screenshots/README.md).
[Machine-readable capture report](screenshots/review-report.json).

Final browser backend: native AMD Vulkan (`RADV RENOIR`) through Chrome/ANGLE.
The primary screenshots show the actual PBR hardware tier. Separate CI browser
checks use SwiftShader and the lightweight material tier; no image is represented
as a throughput benchmark.

Reviewed normal operation, zone entry, tracking, temporal evidence, confirmed alert,
brief passage without alarm, departure, camera view, pipeline, throughput comparison,
compact card, expanded dialog and lightweight layouts at 320/360/393/768/1024 px.
A complete operating cycle was observed passively. Frames immediately before and
after the primary worker's route boundary show continuous motion while the other
actors retain their independent activity. A supplemental continuous 45-second run covers the forklift and safe pedestrian
route joins as well. The capture report records monotonic
simulation time, the sampled states, no page errors and no horizontal overflow.

Review corrections included:

- A stable elevated camera around 42 degrees, with the workshop and actors framed.
- A demand frame on stage inspection so HTML status and physical pose cannot diverge.
- Appropriate camera/edge-device proportions and an unobstructed monitoring image;
  the virtual camera does not render its own housing into the feed.
- A physically separate loading lane, grounded forklift wheels, seated driver and
  a pallet carried above the floor.
- Event visibility only after confirmation; amber zone/beacon and no automatic
  vehicle or machine control.
- A separate camera footprint and configured zone; projected tracking follows the
  actual worker rather than an unrelated animation.
- Optional panels kept out of the default scene, with readable contextual controls.

## Technical scope and retained documents

The CV supports RealSense, Jetson, OpenCV, YOLO/TensorRT, tracking, temporal filtering,
roughly 30-frame FIFO windows, configurable thresholds and an alert-device response.
This demonstration uses a slowed ten-observation example. It does not reproduce a
specific site's exact timing, alarm-clear policy or unknown occlusion prediction.
The optional brief-passage scenario changes the configured illustrative zone and
never teleports an actor. Forklift motion is environmental activity; no forklift
classification, collision avoidance, automatic braking or shutdown is claimed.

The approximately 5 → 30 FPS value is observed video-processing throughput.
The comparison is illustrative, not measured WebGL rendering or TV display cadence.

Unchanged SHA-256:

- Reference PDF: `7851b83eba479b97baf2261e6f085a27cda8ce12199de4dd1882b000e404d8b5`
- Preview JPG: `1218ef7008a51b1c78602a9c1bde843c0c44d5b9daceb267b60ea5f5c1118ab1`

Asset sources, licensing, dimensions and representation limits are in
[ASSETS.md](ASSETS.md). The worker remains stylized, without foot-contact IK or a
separate turn clip. The driver is a locally authored seated pose. The forklift uses
a straight material-handling route, not a certified turning/swept-path simulation.
