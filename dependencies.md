---
Revision    : 1
Last Updated: 2026-05-14
Trigger     : Initial cold audit
Status      : CURRENT
---

# Dependencies

## External Dependencies

- **Name**: Leaflet.js
  - Version: 1.9.4
  - Used In: index.html, js/app.js
  - Purpose: Map rendering, markers, and polyline drawing.
  - Replaceable: Yes (Mapbox GL JS, Google Maps API)
  - Risk: Low (Maintained, but CDN dependency is a single point of failure).
  - Last Checked: 2026-05-14

- **Name**: OSRM API (Public Demo)
  - Version: v1
  - Used In: js/routeEngine.js
  - Purpose: Routing engine to snap coordinates to real paths.
  - Replaceable: Yes (GraphHopper, Mapbox Routing, self-hosted OSRM)
  - Risk: High (The public demo server is rate-limited and not intended for high-volume production use).
  - Last Checked: 2026-05-14

- **Name**: Tailwind CSS (CDN)
  - Version: Latest (via script tag)
  - Used In: index.html
  - Purpose: Rapid UI styling and utility classes.
  - Replaceable: Yes (Compiled Tailwind, Bootstrap, Vanilla CSS)
  - Risk: Medium (Dynamic runtime compilation via CDN is slower than build-time compilation).
  - Last Checked: 2026-05-14

- **Name**: Lucide Icons (CDN)
  - Version: Latest
  - Used In: index.html, js/app.js
  - Purpose: SVG iconography.
  - Replaceable: Yes (FontAwesome, Heroicons)
  - Risk: Low
  - Last Checked: 2026-05-14

- **Name**: OpenStreetMap Tiles
  - Version: unpinned
  - Used In: js/app.js
  - Purpose: Base map tiles.
  - Replaceable: Yes (Stadia Maps, Mapbox, Carto)
  - Risk: Low (OSM tiles are free but have usage policies).
  - Last Checked: 2026-05-14

## DEPRECATED DEPENDENCIES
(Empty)
