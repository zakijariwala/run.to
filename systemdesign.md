---
Revision    : 1
Last Updated: 2026-05-14
Trigger     : Initial cold audit
Status      : CURRENT
---

# System Design: run.to

## System Purpose
run.to is a zero-build, PWA-ready running route generator. It solves the "where should I run today" problem by generating closed-loop, optimized paths based on user-defined distance or time targets. It focuses on high-fidelity, tactile UI (inspired by "Not Boring" apps) and requires no backend, running entirely in the browser.

## Component Map
- **Entry Point (index.html)**: The main structure, including the Leaflet map container, a "Cockpit" sidebar (bottom-sheet on mobile), and script/style injections.
- **Application Orchestrator (js/app.js)**: Manages UI state, theme application, dark mode, geolocation, and coordinates the interaction between the UI and the routing engine.
- **Routing Engine (js/routeEngine.js)**: Contains the core logic for geometric loop generation, OSRM API integration, fuzzy-logic distance optimization, and GPX export.
- **Styles (css/style.css)**: A variable-driven, multi-theme CSS architecture supporting 13 distinct "materials" and a global dark/light mode system.
- **Service Worker (sw.js)**: Handles offline caching of core assets for PWA functionality.
- **Manifest (manifest.json)**: Defines PWA metadata for installation and home-screen behavior.

## Data Flow
1. **Input**: User selects a mode (Distance/Time) and sets a target via a physical-style slider.
2. **Center Point Acquisition**: System requests geolocation or defaults to a hardcoded coordinate.
3. **Geometric Generation**: `RouteEngine` projects a polygon (hexagon by default) around a center point calculated relative to the start.
4. **OSRM Snapping**: The geometric waypoints are sent to the OSRM public API (`router.project-osrm.org`) to find real-world walkable paths.
5. **Optimization Loop**: If the returned path distance deviates significantly (>10%) from the target, the engine adjusts the radius factor and retries (up to 5 times).
6. **Output**: The finalized route is rendered on the Leaflet map, and telemetry (splits, distance, time) is displayed in the UI.

## External Dependencies
- **Leaflet.js (CDN)**: Map rendering and polyline/marker management.
- **OSRM API (Public)**: External routing engine for snapping coordinates to real roads/paths.
- **Tailwind CSS (CDN)**: Utility-first styling for layout and basic components.
- **Lucide Icons (CDN)**: SVG icon set for UI elements.
- **Google Fonts (CDN)**: Typography (Inter, JetBrains Mono, Space Grotesk, etc.).

## Environment Constraints
- **Browser**: Modern web browser with Geolocation API and ES6+ support.
- **Connectivity**: Requires internet access for initial load (unless cached) and OSRM API calls.
- **Secure Context**: Geolocation requires `https://` or `localhost`.

## Known Technical Debt
- **Zero-Build Limitations**: Dependency on multiple external CDNs makes the app vulnerable to outages of those specific services.
- **Fuzzy Logic Performance**: Recursive calls to OSRM can be slow on poor connections; there is no local cache for OSRM results.
- **Mock Fallback**: The Haversine-based mock fallback in `RouteEngine` is basic and doesn't account for real-world obstructions.
- **Global Scope**: Most logic is currently attached to global `RouteEngine` or `Animate` objects rather than modules (due to the zero-build constraint).

## Divergence Log
(Empty)
