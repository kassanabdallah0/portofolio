# Browser visual review

Screenshots are produced by the local Chrome scripts in `scripts/` against the
static export, not design mockups. Both renderer tiers use actual WebGL geometry.
The normal software-renderer tier keeps all actors and uses lighter materials.
Final screenshots use the verified native AMD Vulkan GPU and the full PBR tier.
They document appearance and behavior; they do not measure processing throughput.

| View | Evidence |
| --- | --- |
| Previous feature-branch workcell | [Before](../../engineering-showcase/screenshots/after-1440-vision-initial.jpg) |
| Entire operating workshop | [Normal](desktop-normal.jpg) |
| Entry into Zone A | [Entry](desktop-entry.jpg) |
| Object tracking | [Tracking](desktop-tracking.jpg) |
| Evidence before confirmation | [Confirmation](desktop-confirmation.jpg) |
| Confirmed condition and warning | [Alert](desktop-alert.jpg) |
| Actual monitoring-camera projection | [Camera](desktop-camera.jpg) |
| Optional processing architecture | [Pipeline](desktop-pipeline.jpg) |
| Processing throughput comparison | [5 → 30 FPS](desktop-throughput.jpg) |
| Brief presence without alarm | [Brief passage](desktop-brief-passage.jpg) |
| Departure | [Cycle at 14 seconds](cycle-14.jpg) |
| Before/after the worker route seam | [29.85](cycle-29-85.jpg) · [30.15](cycle-30-15.jpg) |
| Forklift route join | [35.85](actor-cycle-35-85.jpg) · [36.15](actor-cycle-36-15.jpg) |
| Safe pedestrian route join | [43.85](actor-cycle-43-85.jpg) · [44.15](actor-cycle-44-15.jpg) |
| Project card composition | [Card](desktop-card.jpg) |
| Expanded case study | [Dialog](desktop-dialog.jpg) |
| Lightweight mobile representation | [320 px](fallback-320.jpg) · [360 px](fallback-360.jpg) · [393 px](fallback-393.jpg) |
| Tablet fallback | [768 px](fallback-768.jpg) · [1024 px](fallback-1024.jpg) |
| Full-material appearance | [Normal](full-material-normal.jpg) · [Confirmation](full-material-confirmation.jpg) · [Alert](full-material-alert.jpg) |

`review-report.json` records browser errors, viewport overflow checks and the
passively observed full operating cycle. Read VERIFICATION.md for the reviewed
findings, corrections and limitations; rendering a screenshot alone is not approval.
