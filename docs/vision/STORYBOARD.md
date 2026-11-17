# SecuriSPOT Vision — operating workshop

Scope: SecuriSPOT Vision only, on `feat/professional-engineering-showcase` / PR #7.
The existing Liquid Glass shell, CV and five other exhibits are preserved.

## Assessment

The feature-branch workcell already has an artist-authored, licensed rigged worker,
physical camera, Jetson reconstruction and a persistent exhibit clock. Its single
elliptical route and zone-gated bounding box do not distinguish camera visibility
from a configured zone. There is no operating facility around the monitored event.
The redesign retains the useful infrastructure and replaces the Vision scene.

## Composition and materials

One partially open workshop, 14 × 10 metres, viewed from a stable elevated
three-quarter camera around 45 degrees. An indoor cutaway makes routes and monitored
space legible without hiding the actors behind walls. A yard would spread the
story too widely; a closed warehouse would obscure it. Rear shelving and a left
machining/service bay frame a clear central work area. The front pedestrian strip
and the right material-handling lane establish independent, credible activity.
Concrete, painted steel, dark rubber, workwear and restrained aluminium distinguish
objects. Pearl/steel-blue lighting preserves the site's established identity.

The configured Zone A occupies the central foreground. A RealSense-style camera
on a mast observes a larger, perspective-correct frustum. Its floor footprint and
the configured zone are different geometries. A cable connects capture hardware
to the edge station; processing and an industrial beacon respond to the same event.
No automatic vehicle braking, machine shutdown or collision-avoidance is implied.

## Operational storyboard

| Beat | Physical activity | Vision evidence | Response |
| --- | --- | --- | --- |
| Normal | Safe pedestrian circulates; operator works; forklift carries material | Camera watches its actual frustum | Beacon inactive |
| Approach | Primary worker approaches Zone A | Detection appears only inside the camera's image | Stable track ID; no safety event |
| Entry | Worker crosses the configured floor boundary | Relevant observations accumulate | Zone emphasis increases, no immediate alarm |
| Confirmation | Worker remains relevant across successive observations | Ten illustrative observations satisfy this example | Zone A turns amber and beacon activates |
| Departure | Worker leaves the configured region | Active condition ends; detection continues while observable | Beacon returns to monitoring |
| Continuation | Each actor follows its own period | Next event emerges inside an operating facility | No scene reset |

The optional **Passage bref** scenario narrows the illustrative configured zone.
The same worker is directly observed, but its short passage does not satisfy the
example's confirmation threshold. No speculative occlusion prediction is shown.

The CV describes a FIFO of roughly 30 frames and configurable thresholds of 3, 6
or 10 observations. The demonstration uses a deliberately slowed ten-observation
example. It does not claim to reproduce a site's exact rule, timing or alarm-clear
policy. The 5→30 FPS comparison concerns observed processing throughput, not WebGL
rendering or COLAS display cadence. Detailed explanation stays in optional views.

## Motion and interaction

One shared simulation time controls workers, forklift, projected boxes, evidence,
zone material, edge activity and beacon. Main worker: 30-second closed route. Safe
worker: a separate 44-second closed route. Operator: authored idle/interaction poses.
The forklift follows a 36-second material-handling cycle on the clear right lane:
smooth forward travel, stationary lift, reverse travel and stationary lowering.
Its wheels rotate with signed travel. Reversing is appropriate to this compact
loading bay and avoids an implausibly tight turn or a fork sweeping into pedestrians.
All joins have zero velocity; the heading never snaps.

Default **Atelier**, true **Caméra** perspective, optional **Pipeline**, processing
comparison and brief-passage control. Inspection seeks the same domain timeline;
pause freezes the entire story. Camera inspection reuses the existing WebGL canvas.
The card and expanded dialog share the same scene and adapt its framing.

## Budgets and review

Reuse cached worker geometry and skeleton cloning. Optimize the forklift GLB and
record its license. Use instancing for repeated floor/rack details. One bounded
shadow map and capped DPR; no postprocessing, continuous React state updates or
additional animation engine. Mobile/reduced-motion/no-WebGL use a dedicated clear
2D scene. Existing visibility suspension and disposal are retained.

Review actual browser frames for normal/entry/tracking/confirmation/alert/departure,
near route seams, camera view, pipeline, comparison, card, dialog and mobile. Verify
paths, scale, wheel travel, detection projection, contrast and resource lifecycle.
