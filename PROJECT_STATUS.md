# Project status

**State: usable prototype with meaningful workflows; not production-ready as a multi-user SaaS.** On 2026-11-25, the API suite passed with 36 tests, frontend syntax/local-date checks passed, and an isolated browser smoke covered onboarding plus saving and reopening a resume evidence review. Live external services, Docker, accessibility conformance, and a reproducible Playwright suite remain unverified. Details and remaining risks are in [QA_SECURITY_AUDIT.md](./QA_SECURITY_AUDIT.md).

## Implemented

- Existing account-aware application tracking, profile, public job feeds, resume parsing, JD analysis, career drafts, interview practice/history, and realtime setup retained.
- Added input validation and explicit provider errors, tracker search/filter/sort and fields, extended profile data, generated interview question usage, persistent evidence-vault CRUD, saved JD role maps with requirement-to-evidence links, persistent editable portfolio case studies linked to owned project evidence, server-side logout token revocation, a restrictive script Content Security Policy, and centralized untrusted-input guidance for AI prompts.
- Added required first-login profile completion with server-side gating, draft persistence, signout, and legacy-profile backfill. Added persistent account-scoped resume/JD evidence reviews with validated candidate decisions, edit notes, reopening, and deletion. Candidate-reviewed resume edits require confirmation for changed claims, preserve the source, persist a separate approved copy, and export sanitized DOCX/TXT files. Exact phrase matches are explicitly not treated as skill proof.
- Added regression coverage and the required audit, architecture, traceability, testing, and status documentation.

## Important gaps

- Frontend remains vanilla JS rather than React/TypeScript/Vite; storage remains SQLite without Alembic/PostgreSQL.
- No account verification/recovery, robust CSRF/cookie session design, distributed throttling, malware scanning, backup/restore test, or monitoring. Current bearer tokens can now be revoked server-side at logout using an additive auth-database table, with regression coverage.
- A dashboard Outcome Intelligence panel now aggregates saved application stages, repeated role-map evidence gaps, and repeated interview coaching improvements, with account isolation and explicit no-hiring-probability framing. Evidence still is not linked to a particular application/interview outcome; portfolio structure remains incomplete.
- Resume Improvement Intelligence supports persisted candidate evidence review, AI suggestions when configured (or clearly labeled manual source-line editing), per-line accept/reject, explicit confirmation for changed claims, restore-original behavior, saved tailored copies, and DOCX/TXT export. PDF export and detailed section-by-section advice are not implemented. The interactive editor has not received a browser E2E run.
- AI prompt instructions now treat supplied documents and candidate content as untrusted reference data; adversarial prompt-injection resistance is not proven by the mocked regression test.
- Fixed a malformed root CSS declaration found during viewport testing. The current checkout was served in an isolated browser and measured with no horizontal overflow at 390, 834, or 1440 px. The shared 8002 server page is stale/different from this checkout.
- Replaced real-looking API credentials that had been placed in `.env.example` with placeholders. The exposed provider keys must be rotated and checked in Git history.
- Live AI/realtime and job feeds are not verified without credentials/network access. Browser smoke journeys ran, but there is no automated Playwright suite or comprehensive accessibility test.
- Docker CLI was unavailable, so Compose validation was not possible.

See [TESTING_REPORT.md](./TESTING_REPORT.md) for verification limits and [REQUIREMENTS_TRACEABILITY.md](./REQUIREMENTS_TRACEABILITY.md) for coverage.

See [INDEPENDENT_QA_SECURITY_AUDIT.md](./INDEPENDENT_QA_SECURITY_AUDIT.md) for independently reproduced findings and release risks.
