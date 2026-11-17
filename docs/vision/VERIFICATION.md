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
| Affected desktop startup, pause, history, visibility and context-disposal regressions | 7 passed with original timeouts |
| Unsupported WebGL fallback | Existing regression passed (3.0 s) |
| Complete CI workflow | [Current PR #7 checks](https://github.com/kassanabdallah0/portofolio/pull/7/checks) |
| Actual rendered cycle and screenshots | 26 reviewed captures; no page errors or horizontal overflow in capture reports |

The [complete workflow for `14935a6`](https://github.com/kassanabdallah0/portofolio/actions/runs/44101527481)
reported 79 passes, 6 retry passes, 4 failures and 9 intentional skips. The follow-up
restores the native IntersectionObserver's latest entry as the authoritative
visibility state, including dialog clipping. Vision keeps its presentation mounted
at a stable height while its Canvas is released when obscured or offscreen. The
context-disposal test also verifies that suspension preserves height; existing
assertions, timeouts and intentional skips are unchanged.

The Projects hash destination settles immediately instead of continuing a native
smooth scroll while exhibit layouts initialize. Other section anchors retain their
existing behavior. Dialog close clears the selected project immediately while
preserving hash history and focus restoration.

Vision's software-GPU tier uses demand rendering, an 80 ms steady-state interval
and an asynchronous completion fence before the next automatic frame. Explicit
stage/view/resize invalidations can still render promptly. It uses DPR 0.75,
vertex-lit materials, contact shadows and no multisample antialiasing. Other 3D
exhibits classify their actual Canvas renderer before loading models, avoiding an
extra probing context. Each case study owns its renderer state when switching projects. Their software tier uses DPR 1, disabled real-time shadows
and a 64px PBR environment, while retaining the original frame loop and pause
behavior. Hardware rendering is unchanged. These rendering settings do not
represent the 5 → 30 FPS vision-processing improvement.

Capability probing for Vision/hero is cached once per document and released even
if a renderer query throws; the hero requests it only when visible. Matching cloned
worker skeletons share their bone data within each Vision actor: 13 skeletons become
one, with zero skinning-position difference across 1,252 sampled vertices. Source
assets and the scan worker's default animation behavior remain unchanged.

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
