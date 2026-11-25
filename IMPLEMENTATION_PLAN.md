# CareerOS implementation plan

## Architecture decision

Retain the existing FastAPI, SQLite, and browser-native JavaScript application for this remediation pass. It already contains working account isolation, job feeds, resume parsing, application tracking, AI endpoints, and interview practice; replacing it with React/PostgreSQL would risk existing data and require an independent migration/rebuild. This is a documented scope decision, not a claim that the requested React/PostgreSQL target is met.

## Work sequence

1. Inspect source, deployment, configuration, and tests. Findings are in [AUDIT.md](./AUDIT.md).
2. Fix safety and integrity issues in existing workflows; server-side logout revocation is implemented with an additive auth DB migration and regression test.
3. Add first-class evidence capture and account-scoped CRUD. Implemented with regression tests.
4. Add persistent editable portfolio case studies with ownership-checked project evidence links. Implemented with API and isolation tests.
5. Add persistent role maps and explicit requirement-to-evidence links, with account-scoped CRUD and ownership tests. Implemented; the browser analyzer-to-map workflow still needs verification.
6. Record architecture, verification, coverage, and status in these required documents.
7. Verify Python compilation, JavaScript syntax, API tests, deployment configuration, and browser workflows. Results and limitations are in [TESTING_REPORT.md](./TESTING_REPORT.md).

## Completed product-loop increment

- Added an authenticated `/api/outcomes` summary of recorded application stages, role-map evidence gaps, and recurring interview coaching feedback. Added dashboard loading, retry, refresh, empty, and privacy-aware explanatory states. It intentionally does not infer hiring probability or claim causal outcomes. Regression tests cover the aggregation and cross-account isolation.

## Independent QA hardening completed

- Serialized first-account detection to prevent concurrent registration from adopting legacy private data twice.
- Bounded actual DOCX ZIP expansion before parsing; added a compressed-member regression.
- Neutralized VT/FF-prefixed CSV formulas and enforced canonical `YYYY-MM-DD` application dates.
- Added deterministic concurrency, DOCX expansion, date-format, and CSV prefix regression tests. The independently rerun backend suite passes 31 tests.

## Remaining sequence

- Production identity lifecycle: secure HttpOnly session strategy, verification/recovery, distributed throttling, and CSRF plan. Per-token logout revocation is implemented, but token revocation across password changes/account disable and administrative session management are not.
- Normalized PostgreSQL schema and Alembic migrations that preserve account data.
- Component-based frontend, automated browser journey, and responsive/accessibility audit.
- Structured portfolio schemas/export, reminders, and linking role evidence to a specific application/interview outcome. Outcome summaries now aggregate existing records, but no outcome event model or Skill-to-Proof Sprint persistence exists.
- Live-provider tests for AI, job feeds, and WebRTC with configured credentials.

Do not mark a phase complete without implementation and verification evidence.

## 2026-11-25 audit remediation status

### Completed in this pass

- [x] Move application CSV generation to the authenticated backend; neutralize formula cells and test isolation.
- [x] Use the browser's local calendar date for dashboard follow-up/interview boundaries; add a date-boundary unit test.
- [x] Persist interview checkpoints incrementally, recover interrupted sessions from history, and close the checkpoint as completed.
- [x] Keep the 25 primary-question plan separate from adaptive follow-ups in progress and report accounting.
- [x] Make target duration explicit, show elapsed time, and preserve it as pacing guidance without cutting off an answer.
- [x] Bound API request bodies, use strict Pydantic schemas for auth/application writes, cap password length, and bound throttle memory.
- [x] Convert malformed AI provider response exceptions to safe API errors.
- [x] Disable public API docs by default, expand local-data ignore patterns, and replace provider credentials in `.env.example` with placeholders.
- [x] Clarify when resume/JD/answers/audio are sent to configured AI services after the user triggers those workflows.
- [x] Add automated regression tests and perform a temporary-account browser recovery journey.

## 2026-11-25 workflow completion increment

- [x] Add strict career profile completion validation, persistent drafts, explicit completion state, and API-level workspace gate for incomplete profiles.
- [x] Add signout controls in onboarding and career profile with server token revocation.
- [x] Add additive per-account `resume_reviews` storage and create/list/read/update/delete APIs without rewriting existing profile or resume records.
- [x] Add candidate-owned requirement decisions and notes, strict enum/boolean validation, per-report item ownership, account isolation, and source-resume preservation.
- [x] Add source-line resume suggestions (AI when configured; labeled manual editor otherwise), candidate confirmation before changed claims are accepted, persisted tailored copies, and sanitized DOCX/TXT exports.
- [x] Add Role Intelligence review panel, phrase-match caveats, saved-review history, open/delete actions, loading/error/empty states.
- [x] Add regression coverage for review persistence, validation, cross-account access, AI claim verification, onboarding gates, and database upgrade behavior.
- [x] Browser-smoke onboarding and review save/reopen with an isolated temporary account; run Python/JavaScript syntax and API tests.

### Remaining, ordered by risk

1. **Credential response:** revoke/rotate credentials formerly present in `.env.example`; inspect Git history and remove exposed values if committed. Git was unavailable during this pass.
2. **Release validation:** install/use Docker in CI to validate Compose and build; validate the app behind HTTPS with stable secret management.
3. **Data integrity:** design a migration with preservation tests to add foreign-key constraints; broaden migration tests to all existing schema versions.
4. **Privacy and identity:** account recovery, export/delete/retention controls, hardened browser session storage, and distributed rate limiting.
5. **Frontend QA:** add a reproducible automated Playwright suite for onboarding, tracker, evidence graph, interview coach/real modes, recovery, keyboard access, and responsive behavior.
6. **Product loop:** connect application/interview outcomes to evidence and provide explainable recurring-gap recommendations; add persisted Skill-to-Proof Sprints with proof-to-evidence conversion.
7. **Resume completion:** detailed section-by-section coaching, PDF export, valid PDF/DOCX parser fixtures, live AI quality checks, and browser E2E for the editor remain. DOCX/TXT export and candidate-approved tailored-copy persistence are implemented.
8. PDF export, professional DOCX formatting, actual DOCX/PDF parser/export fixtures, and a Playwright resume-workflow specification were added in the 2026-11-25 reliability pass. Live browser execution requires OS browser libraries; Docker image build requires reachable package indexes.
8. **Schema coverage:** add strict schemas to all remaining JSON endpoints and apply consistent maximum field lengths.

The exact tests and their results are recorded in [TESTING_REPORT.md](./TESTING_REPORT.md); code review findings and severity are recorded in [CODE_REVIEW.md](./CODE_REVIEW.md).
