---
Revision    : 1
Last Updated: 2026-05-14
Trigger     : Initial cold audit
Status      : CURRENT
---

# GEMINI.md: Agent Operating Mandate

## 1 — Environment & Shell Standards
- **Runtime**: Browser-based Vanilla JS (ES6+).
- **Style**: Tailwind CSS (CDN) + Custom Properties.
- **Shell**: PowerShell (on win32 development machine).
- **Paths**: All file references in documentation must be relative to the project root.

## 2 — Source Control & Credential Safety
- **Sensitive Files**: None currently (no `.env` or API keys).
- **Safety Rule**: Never commit real credentials if introduced.
- **Git**: Do not stage or commit unless explicitly requested.

## 3 — Codebase Conventions
- **Naming**: camelCase for JS variables/functions, kebab-case for CSS classes/IDs.
- **Organization**: `js/` for logic, `css/` for styles, root for entry points.
- **Themes**: All UI additions MUST support the 13 materials defined in `THEMES` (js/app.js) and respect both Light and Dark mode variables.
- **Zero-Build**: Maintain the zero-build constraint. Do not introduce `npm install` requirements for the *web* portion of the app unless transitioning to a build step is explicitly approved.

## 4 — External Service & API Safety
- **OSRM API**: Be mindful of rate limits on the public demo server.
- **Leaflet/Lucide**: Do not modify CDN URLs unless upgrading versions.

## 5 — Workflow & Execution Order
1. **Research**: Read `implementation.md` and `context.md` before any task.
2. **Implementation**: Maintain visual fidelity. Any UI change must be verified against multiple themes.
3. **Verification**: Since there are no automated tests, manual verification via `index.html` is required.
4. **Documentation**: Update the 10 documentation files after every substantive task.

## 6 — Documentation Standards
- **Substantive Task**: Any change to `RouteEngine` logic, UI terminology, or theme variables.
- **Revision Header**: Every document must carry the Revision header block. Increment the Revision number on every update.
- **Prose-Only**: Documentation should avoid large code blocks; use ASCII or Mermaid for diagrams.

## 7 — Session Continuity & Handoff (CRITICAL)
- **Start**: Read `implementation.md` marker and run Drift Check (RULE SE-5).
- **End**: Update `implementation.md` marker, Audit Log, and `workflow-state.md`.
- **Status**: Never leave a session with `IN_PROGRESS` if a task is finished or blocked.

## 8 — Self-Evolution Rules

### RULE SE-1 — Error Propagation
When any agent encounters an error during development:
1. Do not silently retry or work around it.
2. Classify the error: ENVIRONMENT | LOGIC | DEPENDENCY | CONSTRAINT | UNKNOWN.
3. Record it immediately in `known-issues.md` with full context.
4. If the error reveals an incorrect assumption, update `context.md`.
5. If the error requires a new architectural decision, add an ADR to `decisions.md`.
6. If the error blocks a phase or step, update `implementation.md` marker to `BLOCKED` with a resume note.
7. Update `GEMINI.md` if the error reveals a missing operating rule.

### RULE SE-2 — Block Propagation
When any agent hits a block:
1. Set `implementation.md` STATUS to `BLOCKED` immediately.
2. Write a BLOCK REPORT in `workflow-state.md`.
3. Do not attempt to proceed past a block by guessing.
4. Surface the block to the human in plain language.

### RULE SE-3 — Constraint Discovery
When development reveals a new constraint:
1. Add it to `GEMINI.md` in the relevant section.
2. If it contradicts an existing rule, replace the old rule.
3. Add an ADR entry in `decisions.md`.
4. Update the roadmap in `implementation.md` if necessary.

### RULE SE-4 — Prompt Self-Amendment
When a recurring pattern reveals prompt incompleteness:
1. Append a PROMPT AMENDMENTS section to `GEMINI.md`.
2. Format: ID, Trigger, Original, Amendment, Effective Date.

### RULE SE-5 — Documentation Drift Prevention
At the start of every session:
1. Read `implementation.md`, `context.md`, `GEMINI.md`, `workflow-state.md`.
2. Verify marker status matches codebase state.
3. Check `known-issues.md` for CRITICAL items.
4. Regenerate any missing documentation.
5. Log result in `workflow-state.md`.

### RULE SE-6 — Architectural Divergence Detection
When implemented code diverges from `systemdesign.md` or `flow.md`:
1. Determine if code or documentation is correct.
2. If code is correct: update documentation and add an ADR.
3. If documentation is correct: flag as bug in `known-issues.md`.
4. Append a DIVERGENCE LOG entry to `decisions.md`.

### RULE SE-7 — Evolutionary Audit Trigger
Regenerate or update docs when:
- 3+ new files added.
- Entry point or core logic significantly modified.
- New external dependency introduced.
- A phase in `implementation.md` is `COMPLETE`.
- 5+ known issues resolved.
- Human request.

## 9 — PROMPT AMENDMENTS
(Empty)
