# Software and operations exhibits

These interfaces are original, local reconstructions. They do not connect to equipment, expose production captures, or present synthetic values as live telemetry. The reference CV remains the factual source.

## SecuriSPOT Manager

The application shell presents the camera preview and editable region as the primary interaction. The corner handle supports pointer capture, drag resizing, arrow keys, Home and End; the existing range control is a second accessible editing method. Both edit the same parent-owned value. Editing does not apply a configuration. The existing Apply action progresses through React → REST → Flask → Jetson → confirmation and commits the submitted value; a subsequent edit cannot change an in-flight request.

The alarm-history view demonstrates local captures, associated metadata and temporal filtering using explicitly synthetic records. It retains the edited value when switching views. The camera image is an original SVG technical illustration, not a photo or 3D asset.

## Jetson delivery

The composition separates automatic CI preparation (tag, tests, image publication) from locally triggered activation. The console reveals validation, activation and health-check entries when those steps occur. The software version changes at activation. Selecting the optional rollback scenario does not immediately display a failure: failure appears only at the health-check step; the previous release is shown as restored only after the controller's recovery milestone. Each new illustrative cycle clears the previous recovery result.

The device slot supports the shared 3D renderer; `JetsonIllustration` is an original SVG technical cutaway fallback with recognizable heat sink, fan, USB, HDMI, Ethernet, GPIO and power details. It is not described as a professional 3D asset or manufacturer CAD.

## ELK observability

A distinct infrastructure illustration shows application journals → Logstash → a three-node Elasticsearch cluster → Kibana. The nodes and their protected links persist as events progress. Index packets follow those links; the retained-index belt and expiring record show the configured 180-day ILM policy. Its conceptual animation is not time-scaled telemetry. Separate historical statistics show approximately 306 million documents and 644 GB, labeled historical throughout.

The scene uses SVG for server cutaways and HTML for the query screen and lifecycle visualization. This avoids creating another WebGL context for a story that is clearer as an architecture diagram. Meaningful packet/index motion pauses when the parent simulation stops and is disabled for reduced-motion preferences.

## Verification hooks

`tests/showcase-software.spec.ts` exercises pointer and keyboard resizing, application and view persistence, delayed failure and completed rollback, cycle reset, and the distinctions between historical scale, synthetic activity and retention. Existing tests remain unchanged. Build/browser results and screenshots are recorded in the main delivery report after integration.
