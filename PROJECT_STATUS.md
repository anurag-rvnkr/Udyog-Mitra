# Project status

**Phase 3 verification — 2026-11-25:** 39 backend tests pass and 2 Playwright browser tests pass in Chromium after installing OS browser dependencies. Browser verification covers onboarding, role analysis, saved review, approved edits, PDF download, reload persistence, 390px responsive overflow, anonymous API rejection, logout, and protected-page return. Docker Compose configuration passes; Docker image build remains blocked by PyPI network timeouts from inside the container.

**Phase 2 verification — 2026-11-25:** 39 backend tests pass under Python 3.14 with the active environment. PDF export is implemented with ReportLab and tested by opening the generated PDF with `pypdf`; DOCX export is formatted and opened with `python-docx`. Docker Compose configuration validates, but image build was blocked because the build environment could not reach PyPI. Playwright is configured and Chromium downloaded, but browser execution is blocked by missing OS library `libatk-1.0.so.0` in this environment.

**State: usable prototype with meaningful workflows; not production-ready as a multi-user SaaS.** On 2026-11-25, the independent rerun passed 39 backend tests, syntax/date checks passed, DOCX and PDF files were opened and inspected in tests, and Docker Compose configuration validated. Live external services, the image build, full browser journeys, accessibility conformance, and production deployment remain unverified.

## Implemented

- Existing account-aware application tracking, profile, public job feeds, resume parsing, JD analysis, career drafts, interview practice/history, and realtime setup retained.
- Added input validation and explicit provider errors, tracker search/filter/sort and fields, extended profile data, generated interview question usage, persistent evidence-vault CRUD, saved JD role maps with requirement-to-evidence links, persistent editable portfolio case studies linked to owned project evidence, server-side logout token revocation, a restrictive script Content Security Policy, and centralized untrusted-input guidance for AI prompts.
- Added required first-login profile completion with server-side gating, draft persistence, signout, and legacy-profile backfill. Added persistent account-scoped resume/JD evidence reviews with validated candidate decisions, edit notes, reopening, and deletion. Candidate-reviewed resume edits require confirmation for changed claims, preserve the source, persist a separate approved copy, and export sanitized DOCX/TXT files. Exact phrase matches are explicitly not treated as skill proof.
- Added regression coverage and the required audit, architecture, traceability, testing, and status documentation.

## Important gaps

- Frontend remains vanilla JS rather than React/TypeScript/Vite; storage remains SQLite without Alembic/PostgreSQL.
- No account verification/recovery, robust CSRF/cookie session design, distributed throttling, malware scanning, backup/restore test, or monitoring. Current bearer tokens can now be revoked server-side at logout using an additive auth-database table, with regression coverage.
- A dashboard Outcome Intelligence panel now aggregates saved application stages, repeated role-map evidence gaps, and repeated interview coaching improvements, with account isolation and explicit no-hiring-probability framing. Evidence still is not linked to a particular application/interview outcome; portfolio structure remains incomplete.
- Resume Improvement Intelligence supports persisted candidate evidence review, AI suggestions when configured (or clearly labeled manual source-line editing), per-line accept/reject, explicit confirmation for changed claims, restore-original behavior, saved tailored copies, and sanitized DOCX, PDF, and TXT export. Actual generated DOCX/PDF files are covered by backend tests. The interactive editor is covered by a reproducible Playwright specification, but browser execution is blocked locally by missing OS Chromium libraries. Detailed section-by-section coaching remains incomplete.
- AI prompt instructions now treat supplied documents and candidate content as untrusted reference data; adversarial prompt-injection resistance is not proven by the mocked regression test.
- Fixed a malformed root CSS declaration found during viewport testing. The current checkout was served in an isolated browser and measured with no horizontal overflow at 390, 834, or 1440 px. The shared 8002 server page is stale/different from this checkout.
- Replaced real-looking API credentials that had been placed in `.env.example` with placeholders. The exposed provider keys must be rotated and checked in Git history.
- Live AI/realtime and job feeds are not verified without credentials/network access. Browser smoke journeys ran, but there is no automated Playwright suite or comprehensive accessibility test.
- Docker CLI and Compose are available. `docker compose config` passes; `docker compose build` was attempted twice and blocked at dependency download because PyPI could not be reached from the Docker build environment.

See [TESTING_REPORT.md](./TESTING_REPORT.md) for verification limits and [REQUIREMENTS_TRACEABILITY.md](./REQUIREMENTS_TRACEABILITY.md) for coverage.

See [INDEPENDENT_QA_SECURITY_AUDIT.md](./INDEPENDENT_QA_SECURITY_AUDIT.md) for independently reproduced findings and release risks.

## Phase 3 readiness

| Category | Status | Evidence |
|---|---|---|
| Backend verified | **Verified** | 39 pytest tests pass. |
| Frontend verified | **Verified for targeted workflows** | JavaScript syntax, date regression, and Chromium UI workflows pass. |
| Browser E2E verified | **Verified** | 2 Playwright tests pass, including resume export, reload, responsive overflow, anonymous API rejection, and logout. |
| Docker verified | **Not verified** | Compose configuration passes; image build is blocked by container SSL/PyPI EOF/timeouts. |
| Security reviewed | **Reviewed, production gaps remain** | Account isolation/export authorization/auth revocation/upload controls passed regressions; cookie-based sessions and distributed controls remain blockers for production. |
| Demo ready | **Ready with local fallback** | Fictional demo data is available; external AI/live voice features clearly require credentials and are not claimed live. |
| Production ready | **Not ready** | HTTPS, recovery, secure browser sessions, distributed limits, backups, monitoring, and infrastructure verification remain required. |
