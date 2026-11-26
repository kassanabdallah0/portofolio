# Animated product hero

The text-heavy overview is replaced by one animated scene. Visible copy is limited to the role, project names, short technology labels, icon controls and the Projects/CV actions.

- React configuration window: a cursor resizes the safety zone and the saved-state check follows the presentation stage.
- Passenger portal: content cards slide inside their own application window.
- Separate request/response paths connect SecuriSPOT Manager → Flask → Jetson and MediaSpot → Node.js → AWS.
- The single WebGL scene supplies a sculpted cloud, service pod, floating containers and detailed Jetson with fan/LED motion. Mobile and unavailable WebGL use an SVG counterpart while the application illustrations still animate.
- All motion uses the existing shared clock. Pause, inspection, reduced motion, hidden tabs and project-dialog suspension remain supported. The reference CV, routes and six engineering exhibits are unchanged.

| View                | Before                                          | After                                                |
| ------------------- | ----------------------------------------------- | ---------------------------------------------------- |
| Desktop, 1440 × 900 | [Text overview](screenshots/before-desktop.jpg) | [Animated workbench](screenshots/after-desktop.jpg)  |
| Mobile, 393 × 852   | [Text overview](screenshots/before-mobile.jpg)  | [Compact visual scene](screenshots/after-mobile.jpg) |

Real-time motion samples: [start](screenshots/motion-0.jpg), [2.5 seconds](screenshots/motion-1.jpg), [5 seconds](screenshots/motion-2.jpg). These were captured from the running browser, not generated images.

The [review report](screenshots/review.json) records actual geometry changes, the native AMD/Vulkan renderer, zero page errors, and viewport checks at 320, 360, 393, 768, 1024 and 1440 px. The complete artboard and both actions fit at 393 × 852 and 1440 × 900; tablet layouts stack naturally. All six layouts have no horizontal overflow.

```sh
node docs/hero-animated/capture.mjs http://127.0.0.1:4173/portofolio/
```

The complete local desktop/mobile suite passed: **103 passed, 9 intentional skips**, without retries. Production static export, TypeScript and ESLint also passed.

Capture and regression tests check real SVG geometry, pause/resume, keyboard/dialog focus, no-JavaScript content, reduced-motion freezing, static export, accessibility, CV integrity and existing exhibits. No test retries, timeouts, CI configuration or dependencies were changed.
