---
Revision    : 1
Last Updated: 2026-05-14
Trigger     : Initial cold audit
Status      : CURRENT
---

# Architecture Decision Records

- **ID**: ADR-001
  - Decision: Vanilla JS Monolith (Zero-Build)
  - Context: Need for a lightweight, fast-loading, and easily portable application.
  - Alternatives: React, Vue, Svelte.
  - Rationale: Avoids build-chain complexity, ensures maximum browser compatibility, and allows for instant previews without a dev server.
  - Consequences: Logic is in global scope, harder to manage as it grows, dependency on CDNs.
  - Status: ACTIVE
  - Date: 2026-05-14 (Discovered)

- **ID**: ADR-002
  - Decision: Geometric Loop Projection with OSRM Snapping
  - Context: Generating a closed-loop route without a predefined dataset of paths.
  - Alternatives: Random walk, heat-map based generation.
  - Rationale: Geometric projection ensures a general "loop" shape, and OSRM snapping makes it "walkable". Fuzzy logic allows matching target distances accurately.
  - Consequences: Requires multiple API calls for optimization, can be slow.
  - Status: ACTIVE
  - Date: 2026-05-14 (Discovered)

- **ID**: ADR-003
  - Decision: Multi-Theme Variable System
  - Context: Supporting 13 distinct visual identities ("materials") in a single app.
  - Alternatives: Separate CSS files, inline styles.
  - Rationale: Using CSS variables allows for dynamic theme switching with a single class/attribute change on the body.
  - Consequences: Requires disciplined use of variables in all components.
  - Status: ACTIVE
  - Date: 2026-05-14 (Discovered)

- **ID**: ADR-004
  - Decision: Capacitor for Mobile Porting
  - Context: Releasing on iOS and Android while maintaining the web codebase.
  - Alternatives: React Native, Flutter.
  - Rationale: Maintains the "Vanilla" philosophy and allows the existing high-fidelity CSS to be reused without a total rewrite.
  - Consequences: Performance limited by WebView, requires bridging for native APIs.
  - Status: ACTIVE
  - Date: 2026-05-14 (Discovered)

## DIVERGENCE LOG
(Empty)

## SUPERSEDED
(Empty)
