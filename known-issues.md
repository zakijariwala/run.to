---
Revision    : 1
Last Updated: 2026-05-14
Trigger     : Initial cold audit
Status      : CURRENT
---

# Known Issues

## Triage List

- **ID**: ISSUE-001
  - Severity: HIGH
  - Type: ENVIRONMENT
  - Location: index.html, js/app.js
  - Description: Dependency on multiple external CDNs (Tailwind, Leaflet, Lucide).
  - Impact: If any CDN is down, the app fails to render or function correctly. Offline functionality is limited to assets cached by the service worker, but the CDNs themselves might not be perfectly handled if they change versions.
  - Suggestion: Bundle dependencies locally (e.g., using a build step or downloading the assets).
  - Status: OPEN
  - Resolved In: pending

- **ID**: ISSUE-002
  - Severity: HIGH
  - Type: CONSTRAINT
  - Location: js/routeEngine.js:58
  - Description: Use of OSRM public demo server for production-like functionality.
  - Impact: Subject to rate limits, downtime, and potential removal by the OSRM project. Not suitable for a scaled application.
  - Suggestion: Implement a self-hosted OSRM instance or move to a professional provider (Mapbox/GraphHopper).
  - Status: OPEN
  - Resolved In: pending

- **ID**: ISSUE-003
  - Severity: MEDIUM
  - Type: FRAGILITY
  - Location: js/routeEngine.js:93
  - Description: Mock fallback for OSRM failure uses simple Haversine formula.
  - Impact: Mock routes ignore buildings, water, and non-walkable areas, leading to impossible paths on the map.
  - Suggestion: Improved mock logic or a more robust retry mechanism with cached tiles.
  - Status: OPEN
  - Resolved In: pending

- **ID**: ISSUE-004
  - Severity: LOW
  - Type: MISSING
  - Location: system-wide
  - Description: Total lack of automated testing (unit or E2E).
  - Impact: High risk of regressions when modifying complex logic like the `RouteEngine`.
  - Suggestion: Add Vitest or Jest for `RouteEngine` logic and Playwright for UI flows.
  - Status: OPEN
  - Resolved In: pending

- **ID**: ISSUE-005
  - Severity: LOW
  - Type: DEAD-CODE
  - Location: js/routeEngine.js:192
  - Description: `RouteEngine.exportToGPX` is defined but not linked to any UI button.
  - Impact: Feature is currently unreachable for users.
  - Suggestion: Add the `btn-export-gpx` to `index.html` and wire it up in `app.js`.
  - Status: OPEN
  - Resolved In: pending

## RESOLVED LOG
(Empty)
