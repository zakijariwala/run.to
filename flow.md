---
Revision    : 1
Last Updated: 2026-05-14
Trigger     : Initial cold audit
Status      : CURRENT
---

# Flow Catalogue

## Function Catalogue

### js/app.js
- **Name**: Animate.spring
  - File: js/app.js:52
  - Signature: (el: HTMLElement, props: Object, duration: number) -> void
  - Purpose: Applies a spring-like CSS transition to an element.
  - Inputs: Element, style properties, duration.
  - Outputs: Mutates element style.
  - Calls: None
  - Called By: UI event listeners, applyTheme
- **Name**: Animate.staggerEntry
  - File: js/app.js:57
  - Signature: (selector: string) -> void
  - Purpose: Animates a list of elements with a staggered entrance effect.
  - Inputs: CSS selector.
  - Outputs: Mutates styles of matching elements.
  - Calls: Animate.spring
  - Called By: btnGenerate listener
- **Name**: Animate.tweenNumber
  - File: js/app.js:68
  - Signature: (el: HTMLElement, end: number, duration: number, suffix: string) -> void
  - Purpose: Linearly interpolates a numeric value in an element's innerText.
  - Inputs: Element, target number, duration, unit suffix.
  - Outputs: Mutates element innerHTML over time.
  - Calls: requestAnimationFrame
  - Called By: btnGenerate listener
- **Name**: applyTheme
  - File: js/app.js:93
  - Signature: (theme: string) -> void
  - Purpose: Applies a material skin and updates UI terminology.
  - Inputs: Theme name.
  - Outputs: Mutates `document.body` attributes, `localStorage`, and various UI elements.
  - Calls: lucide.createIcons, RouteEngine.setStyle (implied)
  - Called By: DOMContentLoaded, themeSelect listener
- **Name**: toggleDarkMode
  - File: js/app.js:141
  - Signature: (force: boolean) -> void
  - Purpose: Toggles the global dark mode state.
  - Inputs: Optional force boolean.
  - Outputs: Mutates `document.body` class, `localStorage`, and icons.
  - Calls: applyTheme, lucide.createIcons
  - Called By: btnThemeToggle listener, DOMContentLoaded
- **Name**: initMap
  - File: js/app.js:164
  - Signature: () -> void
  - Purpose: Initializes the Leaflet map and base tile layer.
  - Inputs: None
  - Outputs: Sets global `map` and `startMarker`.
  - Calls: L.map, L.tileLayer, L.circleMarker
  - Called By: DOMContentLoaded
- **Name**: locateUser
  - File: js/app.js:174
  - Signature: () -> void
  - Purpose: Requests current geolocation and updates map center.
  - Inputs: None
  - Outputs: Mutates `userLocation` and `map` view.
  - Calls: navigator.geolocation.getCurrentPosition
  - Called By: DOMContentLoaded, btnRetryLocation listener

### js/routeEngine.js
- **Name**: RouteEngine.generateGeometricLoop
  - File: js/routeEngine.js:13
  - Signature: (lat: number, lng: number, targetDistance: number, radiusFactor: number, sides: number, startAtLocation: boolean) -> Array<Object>
  - Purpose: Calculates a polygon path around a center point.
  - Inputs: Start coords, target distance, scaling factor, side count, start flag.
  - Outputs: Array of {lat, lng} waypoints.
  - Calls: Math.cos, Math.sin
  - Called By: RouteEngine.findOptimizedRoute
- **Name**: RouteEngine.fetchOSRMRoute
  - File: js/routeEngine.js:52
  - Signature: (waypoints: Array<Object>) -> Promise<Object>
  - Purpose: Fetches a snapped route from OSRM or falls back to a mock.
  - Inputs: Waypoint array.
  - Outputs: Route object (distance, duration, coordinates, etc.).
  - Calls: fetch (OSRM API)
  - Called By: RouteEngine.findOptimizedRoute
- **Name**: RouteEngine.findOptimizedRoute
  - File: js/routeEngine.js:109
  - Signature: (lat: number, lng: number, targetDistanceMeters: number, options: Object) -> Promise<Object>
  - Purpose: Iteratively optimizes a route to match a target distance.
  - Inputs: Start coords, target meters, options (retries, sides, etc.).
  - Outputs: Finalized route data object.
  - Calls: RouteEngine.generateGeometricLoop, RouteEngine.fetchOSRMRoute
  - Called By: btnGenerate listener (js/app.js)
- **Name**: RouteEngine.calculateSplits
  - File: js/routeEngine.js:161
  - Signature: (totalDistanceMeters: number, avgPaceMinPerKm: number) -> Array<Object>
  - Purpose: Generates kilometer splits with slight random variance.
  - Inputs: Total meters, base pace.
  - Outputs: Array of {km, time} strings.
  - Calls: None
  - Called By: btnGenerate listener (js/app.js)
- **Name**: RouteEngine.exportToGPX
  - File: js/routeEngine.js:192
  - Signature: (routeData: Object) -> void
  - Purpose: Generates and triggers a browser download of a GPX file.
  - Inputs: Route data object.
  - Outputs: File download.
  - Calls: Blob, URL.createObjectURL
  - Called By: btnExportGpx listener (not currently used in app.js, but defined)

## Execution Trace

1. **User Action**: User clicks `btn-generate`.
2. **app.js**: Event listener triggers. 
3. **app.js**: UI updates to "Thinking..." state, `loading-overlay` shown.
4. **app.js**: Calls `RouteEngine.findOptimizedRoute` with user's target.
5. **routeEngine.js**: `findOptimizedRoute` begins iteration 1.
6. **routeEngine.js**: Calls `generateGeometricLoop` to create initial polygon waypoints.
7. **routeEngine.js**: Calls `fetchOSRMRoute` with these waypoints.
8. **routeEngine.js**: `fetchOSRMRoute` performs a `fetch` request to `router.project-osrm.org`.
9. **Network**: OSRM API returns a snapped GeoJSON path.
10. **routeEngine.js**: `fetchOSRMRoute` parses GeoJSON and returns route object (distance, coords).
11. **routeEngine.js**: `findOptimizedRoute` checks if distance is within 10% of target.
    - If NO: Adjusts `radiusFactor` and recurses to step 5 (max 5 times).
    - If YES: Returns final `routeData`.
12. **app.js**: Receives `routeData`.
13. **app.js**: Removes old `routePolyline` (if any) and creates new `L.polyline`.
14. **app.js**: Animates polyline drawing using `strokeDashoffset`.
15. **app.js**: Maps fits bounds of the new polyline.
16. **app.js**: Triggers `Animate.staggerEntry` for result cards.
17. **app.js**: Calls `Animate.tweenNumber` for distance and time readouts.
18. **app.js**: Calls `RouteEngine.calculateSplits` and populates `splits-list`.
19. **app.js**: Updates `btn-google-maps` href with waypoint-encoded URL.
20. **app.js**: UI returns to "Find Loop" state.

## STALE ENTRIES
(Empty)
