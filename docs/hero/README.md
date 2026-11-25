# Software-first homepage

The first screen now presents Abdallah Kassan as a Full Stack / Backend software engineer. The copy and two independent product paths come from the reference CV:

- **SecuriSPOT Manager:** React/TypeScript configuration interface → Python/Flask API → configuration and supervision on Jetson.
- **MediaSpot:** React passenger portal → Node.js/TypeScript API → services hosted and operated on AWS.

These are simplified illustrations of separate professional projects. They do not combine the products into one architecture or represent production screenshots.

## Before and after

| View                | Before                                          | After                                                |
| ------------------- | ----------------------------------------------- | ---------------------------------------------------- |
| Desktop, 1440 × 900 | [Original hero](screenshots/before-desktop.jpg) | [Software-first hero](screenshots/after-desktop.jpg) |
| Mobile, 393 × 852   | [Original hero](screenshots/before-mobile.jpg)  | [Software-first hero](screenshots/after-mobile.jpg)  |

The desktop overview stays within the first screen. Mobile places the role and both actions above the fold, with the complete stacked paths below: [320 px](screenshots/overview-320.jpg), [393 px](screenshots/overview-393.jpg).

## Interaction and verification

The Interfaces, API & Backend, and Cloud & Edge controls highlight the same layer in the HTML diagram and supporting 3D scene. The shared 18-second clock advances one layer every six seconds; inspection holds the selected view, repeated selection resumes it, and manual pause remains independent. Reduced motion and unavailable WebGL preserve the complete HTML/SVG overview.

- Production static export, TypeScript and ESLint passed.
- Full local desktop/mobile suite: **103 passed, 9 intentional skips**, without retries. Focused hero checks also cover automatic progression, inspection, pause, keyboard project opening/focus restoration, first-screen actions, reduced motion and no-JavaScript content.
- Screenshots reviewed at [320](screenshots/viewport-320.jpg), [360](screenshots/viewport-360.jpg), [393](screenshots/viewport-393.jpg), [768](screenshots/viewport-768.jpg), [1024](screenshots/viewport-1024.jpg), and [1440](screenshots/viewport-1440.jpg) pixels.
- Native-renderer inspection: [Backend](screenshots/desktop-backend.jpg), [Cloud & Edge](screenshots/desktop-production.jpg). The actual existing Canvas reports the selected layer; no feature-probe context is created.
- [Capture report](screenshots/review.json) records text containment, horizontal overflow, first-screen action bounds, renderer and browser errors. The comparison script uses real Chromium/SwiftShader; the responsive review uses the existing hardware renderer when available.
- All six project demonstrations, hash routes, reference PDF and preview remain unchanged. PDF SHA-256: `7851b83eba479b97baf2261e6f085a27cda8ce12199de4dd1882b000e404d8b5`.

Capture commands (Node 20.19+; a local preview on port 4173):

```sh
node docs/hero/capture.mjs after http://127.0.0.1:4173/portofolio/
node docs/hero/review.mjs http://127.0.0.1:4173/portofolio/
```

The before images were captured from the public homepage before this change. The original CV document, preview, and download URL have not been edited.
