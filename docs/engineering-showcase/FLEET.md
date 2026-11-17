# MediaSpot exhibit

The original orbit of box-shaped buses has been replaced with a miniature two-lane road, three independently identified authored bus models, a passenger phone, a magnified RUTX11 reconstruction, a cellular mast and a separate AWS platform. The bus GLB and its license are documented in `ASSETS.md`. The phone, router, road and infrastructure pieces are original code-native reconstructions, not manufacturer CAD.

## Narrative and technical scope

The default camera frames the representative fleet. Selecting a bus retains its A/B/C identity, first brings the camera toward that moving vehicle, then frames the enlarged onboard equipment. Architecture view frames the road and AWS environment together. Bus motion never resets when selecting a vehicle or changing perspective.

- Local access: passenger phone → local Wi-Fi → RUTX11.
- External connectivity: the selected bus → cellular mast. The mast is a visual shorthand for cellular/external connectivity, not an AWS service.
- Infrastructure access: RUTX11 OpenVPN client → certificate-authenticated OpenVPN server on EC2.
- Application content: a separate external path reaches API Gateway → Lambda / Node.js / TypeScript → S3. It does not claim that all application traffic traverses the management VPN.
- Reporting: EventBridge invokes Lambda; CloudWatch supplies application logs; Lambda produces the monthly PDF delivered through SES.

CloudWatch is not shown as a direct router hardware monitor. The reference CV separately describes SMS diagnostics, OpenVPN status and Teltonika RMS for router supervision. All displayed activity is illustrative and offline. Three moving models represent a real deployment of approximately 70 buses; the scene is not live fleet tracking.

## Motion and resource decisions

Each lane has its own closed curve and cached arc-length lookup. A shared elapsed time drives physical distance, heading, camera tracking, packet progress and cumulative wheel rotation. Inner and outer lane lengths are different; calculating both from the centerline would visibly slip the wheels around bends. The model receives cumulative travel in native meters, compensating for its miniature scale.

Route positions wrap continuously while cumulative wheel travel never wraps. Network nodes stay visible once introduced; active links brighten and packets fade at their endpoints, so the architecture does not clear and reconstruct every cycle. Only the selected moving-bus uplink updates line geometry each frame; fixed links cache their geometry. All sprite textures and owned geometries have explicit cleanup. Bus geometry is shared through the existing model cache; only livery materials are cloned per vehicle.

The scene uses the portfolio's existing visibility and shared simulation controller. It creates no separate clock or WebGL canvas. The shared renderer controls DPR, lighting, shadows and offscreen disposal. Mobile, reduced-motion and unsupported-WebGL alternatives remain outside this module.

## Verification

`tests/showcase-fleet.spec.ts` checks position/heading continuity at each lane's wrap, wheel distance against measured scene movement on straights and bends, and persistent identity across repeated route cycles. These tests caught and corrected insufficient arc-length lookup resolution before visual review. Screenshot evidence and final browser results are recorded in the showcase review document.
