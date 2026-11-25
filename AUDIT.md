# CareerOS current audit (2026-11-25)

This replaces earlier checkpoint notes that no longer matched the source. Coverage claims below are based on current source inspection, the latest API test run, and the isolated browser smoke test recorded in [TESTING_REPORT.md](./TESTING_REPORT.md).

## Requirement status

| Area | Current status | Evidence / remaining gap |
|---|---|---|
| Dashboard | **Partially implemented** | Account application/profile/interview data feeds metrics and action queue. No persistent event log or calendar reminder delivery. |
| Candidate profile | **Partially implemented** | Profile CRUD includes resume and free-text education, projects, achievements, preferences, and links. Fields are not normalized and some values require manual copy into tools. |
| Evidence graph | **Partially implemented** | User-scoped evidence plus saved role maps and explicit requirement-to-evidence links. Does not yet connect requirements to application outcomes or interview performance; analysis matches remain suggestions. |
| Job discovery | **Implemented, live source unverified** | Arbeitnow and Remotive feed parsing, ranking, deduplication, remote/location search and source attribution exist. No hybrid/company filter; sources can be stale or unavailable. |
| Resume and JD analysis | **Partially implemented** | Resume upload and extraction plus AI or labeled heuristic analysis use supplied text. No broad parser fixture suite or live AI output verification. |
| Application tracking | **Implemented and API-tested** | CRUD, per-account isolation, status/priority/date/recruiter/JD data, search/filter/sort, CSV. No reminder delivery; browser journey is not fully automated. |
| Career studio | **Partially implemented** | Editable drafts for outreach, resume, portfolio and prep. Most generated drafts are not saved as reusable assets. |
| Portfolio | **Partially implemented and browser-smoke-tested** | Save/open/edit/delete case-study content; optional project evidence link is account-scoped. Content is not a validated multi-section schema and no package export exists. |
| Interview preparation | **Partially implemented** | 25-question setup, coach/real modes, local/AI feedback, report and history paths. Full journey, retry semantics and live AI generation need verification. |
| Realtime voice | **Implemented but not verified live** | Server-issued ephemeral credential and browser WebRTC implementation. No live provider session, reconnection or microphone matrix test performed. |
| Authentication and security | **Partially implemented** | PBKDF2, expiring signed bearer tokens, account-specific SQLite, private route checks, upload limits/validation, persistent per-token logout revocation, restrictive script CSP and permissions policy. Recovery/verification, secure cookie strategy, shared rate limiting and removal of the inline-style CSP exception remain. |
| AI integration | **Partially implemented** | Server-side provider calls, response validation, timeout/rate-limit errors, and explicit no-key fallback. Live quality, cost controls and provider privacy behavior are not verified. |
| Data persistence | **Partially implemented** | Per-account SQLite and additive table/column setup. No versioned migration framework, PostgreSQL conversion, backup or restore test. |
| UX/accessibility | **Partially implemented** | Main navigation, responsive CSS, forms, error/empty states and portfolio/evidence pages render. No full keyboard, screen-reader, contrast or viewport matrix. |
| Deployment | **Partially implemented** | Dockerfile, Compose, volume, environment example, launch scripts and health endpoint. Docker is unavailable, so Compose was not validated. |
| Requested stack | **Not implemented** | Current code is FastAPI + SQLite + vanilla JavaScript; not React/TypeScript/Vite/Tailwind/PostgreSQL. Retention rationale and migration risks are documented in [ARCHITECTURE.md](./ARCHITECTURE.md). |

## Highest-priority defects and risks

1. **Production identity lifecycle:** browser bearer token remains in local storage; no account recovery/verification or distributed login throttling. Logout revokes the current token hash, but cannot revoke all other sessions or support administrative session control. The CSP blocks scripts except same-origin, but still allows inline styles.
2. **Storage architecture:** no SQLAlchemy/Alembic migration path or PostgreSQL support. Existing per-user SQLite files must be preserved in any future migration.
3. **Core product gaps:** evidence links cover saved role requirements, but not application outcomes or interview performance; portfolio content is free text; most career drafts are not saved; no reminders/calendar delivery or full activity log.
4. **AI prompt safety:** shared prompt instructions now identify resume/JD/answer/context text as untrusted reference material; this is defense-in-depth, not a substitute for adversarial evaluation or structured provenance enforcement.
5. **External dependencies:** job feed freshness, AI output and realtime session establishment require live network/provider conditions not established by tests.
6. **Verification:** API coverage is improving, and portfolio received a browser smoke test. The full registration-to-export journey, responsive viewport checks, Docker, backup recovery and live realtime remain unverified.

## Confirmed broken workflows

- A malformed `rgba()` in the root stylesheet caused a mobile horizontal overflow in the shared browser (375px viewport, 440px document width) and prevented reliable hiding of inactive UI. The missing parenthesis was fixed. The updated stylesheet parses with no top-level errors and the `.hidden` rule resolves correctly; the post-fix browser viewport rerun timed out, so layout closure is not claimed as verified.
- The earlier logout success-without-revocation defect was fixed and tested. Absence of further reproduced failures does not establish that untested integrations or browser paths work.

## Test gaps

- Full browser journeys for profile, resume parsing, job discovery, application updates/CSV, interview report, portfolio, and sign-out.
- Ownership tests for every private resource type and mutation (applications/profile/interviews/evidence/portfolio).
- Browser test of analyzer-to-role-map save and requirement-to-evidence linking; current role-map API isolation/link test is present.
- Resume parser fixtures for malformed, encrypted, oversized, and scanned documents.
- Provider timeout, malformed response, rate limit, and live success tests for each external integration.
- Responsive/accessibility checks and Docker/backup/restore verification.

See [REQUIREMENTS_TRACEABILITY.md](./REQUIREMENTS_TRACEABILITY.md) for requirement-level mapping and [TESTING_REPORT.md](./TESTING_REPORT.md) for actual results.
