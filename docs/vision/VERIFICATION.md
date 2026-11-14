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
| Initial complete desktop/mobile run | 86 passed, 9 intentional skips, 3 failures diagnosed below |
| Corrected regressions, unchanged assertions/timeouts | 5 passed, 1 intentional mobile skip |
| Final complete workflow | [Current PR #7 checks](https://github.com/kassanabdallah0/portofolio/pull/7/checks) |
| Actual rendered cycle and screenshots | 19 primary captures; no page errors or horizontal overflow; full cycle observed |
| Full PBR reference views | 3 captures on the native hardware tier; no page errors |

The full run identified a rapid-dialog GPU-initialization timeout and a repeated
stage-selection failure on desktop/mobile. The latter came from a CSS decorative
dot entering the button's accessible name after selection. The shared control now
has a stable explicit accessible label; its visual appearance is preserved. No
existing test was removed or weakened. The original failing cases were rerun with
their existing timeouts and passed after the corrections.

Vision now establishes its initial viewport state before GPU setup can delay the
first observer delivery. Later transitions retain the existing newest-entry
IntersectionObserver handling. GPU creation is deferred briefly on hardware and
until a stable visit on software renderers; the lightweight live illustration
appears during loading. Software material selection happens before the first GPU
frame, so it does not first compile the expensive material tier. Original cached
materials are preserved and restored on cleanup.

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
