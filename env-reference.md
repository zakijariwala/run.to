---
Revision    : 1
Last Updated: 2026-05-14
Trigger     : Initial cold audit
Status      : CURRENT
---

# Environment Reference

## Application Settings (LocalStorage)

- **Variable**: `theme-pref`
  - Found In: js/app.js:95, js/app.js:290
  - Purpose: Stores the user's selected material theme (e.g., 'run.to', 'stone.to').
  - Required: No
  - Format: String
  - Default: 'run.to'

- **Variable**: `dark-mode`
  - Found In: js/app.js:143, js/app.js:286
  - Purpose: Stores the user's preference for dark or light mode.
  - Required: No
  - Format: Boolean (stringified)
  - Default: System preference (matchMedia)

## External Variables (CDN/API)

- **Variable**: OSRM_URL
  - Found In: js/routeEngine.js:58
  - Purpose: The endpoint for the OSRM routing service.
  - Required: Yes
  - Format: URL
  - Default: `https://router.project-osrm.org/route/v1/foot/`

## .env.example
```
# This project is a Vanilla JS monolith and currently does not use .env files.
# All configuration is handled via local storage or hardcoded CDN URLs.
# For future Capacitor integration, the following might be required:

# CAPACITOR_APP_ID=com.runto.app
# CAPACITOR_APP_NAME=run.to
```

## REMOVED VARIABLES
(Empty)
