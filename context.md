# run.to | Project Context

## Overview
`run.to` is a high-fidelity, "Not Boring" inspired route generation engine. It transforms a standard utility into a tactile, cockpit-like object using bold typography, 3D depth, and spring-based physics.

## Tech Stack
- **Frontend:** Vanilla HTML5, CSS3 (Custom Properties), Tailwind CSS (Zero-build CDN).
- **Maps:** Leaflet.js with custom dark/light filtering.
- **Icons:** Lucide Icons.
- **Typography:** Space Grotesk (HUD/Headers), JetBrains Mono (Data/Telemetry), Inter (UI).

## Architecture
- **Material System:** Dual-tier CSS variable system. `:root` defines Light mode base, `.dark` class on `<body>` overrides for Dark mode.
- **Theming Engine:** 13 materials (Glass, Stone, Metal, etc.) applied via `data-theme`. Variable-driven to support both Light and Dark variants.
- **Surgical HUD Overhaul:** Premium "Not Boring" components with physical properties:
    - **Altimeter:** 900 weight wordmark/display with dynamic glow.
    - **Physical Slider:** Interactive track fill (`--pct`) and spring-animated thumb.
    - **Tactile Toggle:** 3D segmented control with "sitting up" active state.
    - **Dashboard Gauges:** Material cards with inset highlights and top-accent lines.
    - **Action Button:** Heavy 3D "punch-down" physics on press.

## Key Functions (js/app.js)
- `applyTheme(theme)`: Sets material skin, updates `localStorage`, and swaps UI terminology.
- `toggleDarkMode()`: Switches between Light/Dark modes, updates icons, and saves preference.
- `updateSliderTrack()`: Syncs physical track fill with input value.
- `Animate`: Module for `spring`, `tweenNumber` (gauge LERP), and `staggerEntry`.

## Recent Changes
- Finalized global Light/Dark mode toggle with tactile HUD button.
- Refactored entire CSS to be variable-driven (no hardcoded hex in components).
- Integrated surgical overhaul for all cockpit components.
- Established `context.md` for session continuity.

## Future Directives
- Maintain "Not Boring" physicality in all new components.
- Ensure all text terminology maps correctly to the 13 materials in `THEMES` object.
