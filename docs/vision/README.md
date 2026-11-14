# SecuriSPOT Vision — operating workshop

The Vision exhibit is now a miniature workshop with three rigged workers, an
occupied electric forklift, a working CNC station, storage, pedestrian markings,
a camera, edge computer and warning beacon. The default camera stays at an elevated
three-quarter viewpoint. The other five projects and the Liquid Glass portfolio
shell retain their existing design and content.

A worker approaches the monitored region, becomes directly observable, crosses
Zone A and accumulates successive observations. Only then does the zone turn amber
and the beacon activate. The worker leaves, the active event clears, and the site
continues operating. The camera's observable frustum is separate from the configured
zone. The brief-passage scenario illustrates a directly observed person whose short
presence produces no confirmed alarm.

`visionTimeline.ts` owns positions, signed wheel travel, observation visibility,
zone membership, evidence and event state. The main worker, pedestrian, workstation
operator and forklift have different periods. Closed walking routes and eased
forward/reverse forklift motion avoid teleports and synchronized scene resets.
The same time ref drives skeletal clips, projected boxes, edge activity and the
beacon. Stage inspection requests a demand frame at the exact selected time.

The **Caméra** perspective uses the same virtual camera's perspective projection
inside the existing renderer. **Pipeline** reveals capture, inference, tracking,
metadata, temporal filtering and the alert device. **5 → 30 FPS** illustrates the
observed approximately sixfold processing improvement; it is not a browser benchmark
or the COLAS display rate. The illustrative ten-observation sequence is deliberately
slowed and does not reproduce an exact production site's rule or alarm-clear policy.

Asset provenance, hashes and adaptations: [ASSETS.md](ASSETS.md).
Art direction and technical storyboard: [STORYBOARD.md](STORYBOARD.md).
Browser evidence and check results: [VERIFICATION.md](VERIFICATION.md).

## Resource management

Models load dynamically. Three worker instances and the seated driver reuse cached
artist-authored geometry with independent skeletons. Repeated environment details
are instanced. Vision uses a 64-pixel environment map, one bounded 512² shadow map
and maximum DPR 1.25 on hardware GPUs. Software renderers retain the real 3D scene
at DPR 1 with vertex-lit materials and soft contact shadows instead of a dynamic shadow pass or reflection prefilter. Material selection occurs before the first GPU draw. This tier is
selected from renderer capabilities, not a test flag.

A short visibility debounce avoids allocating a GPU context for a fleeting dialog
visit. Initial viewport measurement keeps Vision's controller responsive before the
first observer delivery; subsequent visibility changes still use the existing
observer. Obscured/offscreen scenes unmount, and renderer disposal is tested with
actual retained WebGL contexts. Mobile, reduced motion and unavailable WebGL use a
purpose-built lightweight illustration driven by the same timeline.

No runtime CDN, new dependency, animation engine, production telemetry, automatic
forklift braking or machinery-control claim is introduced. The original CV and
preview are unchanged.

## Representation limits

The worker is an artist-authored stylized rig, with no foot-contact IK or separately
authored turn clip. The driver uses a locally authored seated pose. The generic
forklift performs straight forward/reverse loading activity; no certified swept path
or turning radius is implied. The optional scenario demonstrates brief presence,
not an invented occlusion-prediction capability. Hardware and environment geometry
are nominal technical reconstructions, not manufacturer CAD.
