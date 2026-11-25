# Code review — QA/security remediation

Review scope: current FastAPI/SQLite/vanilla-JS checkout and its existing tests. Git is unavailable in this environment, so repository history, tracked-file state, and a canonical diff could not be inspected. Secret values were not read during this review. Requirement-level evidence is recorded in [QA_SECURITY_AUDIT.md](./QA_SECURITY_AUDIT.md).

## Findings by severity

### High

1. **Provider credentials had been placed in `.env.example`. — Fixed in working tree; provider action remains.** The values were replaced with safe placeholders and a regression test now checks this file. Revoke/rotate the credentials and search Git history; this environment cannot verify or rewrite history.
2. **Application CSV export could execute spreadsheet formulas. — Fixed.** Export moved to an authenticated, account-scoped API endpoint, cells beginning with formula markers (including common whitespace/BOM prefixes) are prefixed as text, and the response is `no-store`. Regression tests cover formula cells and cross-account empty export.
3. **Interview reports conflated primary questions with adaptive follow-ups and active sessions were lost on reload. — Fixed for tested flow.** Checkpoints now persist server-side as `in_progress`, autosave at answer progression, can be resumed from interview history, and update to `completed`. Reports distinguish 25 primary questions, adaptive follow-ups, and total responses. A temporary-account browser run verified resume after reload and a final report after one answer plus 24 skips.
4. **Request bodies and strict fields were not consistently bounded. — Partially fixed.** An ASGI body cap rejects oversized API bodies (512 KiB; resume multipart 9 MiB), and auth/application write requests use strict Pydantic schemas with extra fields rejected. Other endpoints still use dictionaries with endpoint-specific limits; server-side content-length and multipart handling should be reviewed before exposing publicly.
5. **Exposed API documentation expanded the anonymous API surface. — Fixed by default.** Swagger/OpenAPI endpoints are disabled unless `CAREEROS_ENABLE_API_DOCS=1`; a regression test verifies they return 404 by default.

### Medium

1. **Date boundary used UTC while dashboard reminders use the user's calendar day. — Fixed.** `dateToday()` now builds a local calendar date; a Node regression test simulates the UTC/local date boundary.
2. **Auth input allowed unbounded password work and throttle buckets accumulated. — Fixed for current process.** Passwords are bounded at 256 characters; expired attempts are pruned and the in-memory bucket map is capped at 4,096. Distributed rate limiting remains required for multi-process/public deployment.
3. **Provider response parsing could leak malformed payload exceptions as 500s. — Fixed.** Provider timeouts return 504, rate limits return 503, and malformed response structures return a safe 502. Tests cover timeout, rate-limit, and malformed JSON.
4. **User databases and local data directories were not comprehensively ignored by Git. — Fixed in ignore rules.** Added per-account DB, auth DB, SQLite sidecars, uploads, resumes, exports, test output, and local data patterns to ignore lists. Whether any file is already tracked could not be checked because Git is unavailable.
5. **The UI understated provider data sharing. — Fixed in visible copy.** Analysis and interview UI now state when resumes, job descriptions, answers, or microphone audio are sent to configured AI providers after the user starts those actions. Provider retention/deletion controls are not implemented.

### Low / architectural follow-up

1. **Database relationships rely partly on application code rather than SQLite foreign keys.** Existing databases have additive migrations but no tested foreign-key rebuild strategy; adding constraints safely requires a migration that preserves existing rows.
2. **Connections are manually closed across much of the codebase.** Newly added export/interview checkpoint routes close in `finally`, but broad connection-lifecycle normalization has not been applied to every route.
3. **No automated Playwright package/suite is installed.** Browser workflows were exercised with the integrated browser, but those checks are not reproducible in the repository test command. Keyboard-only and WCAG contrast checks remain.
4. **Outcome intelligence is partially implemented; proof sprints remain missing.** The dashboard now aggregates account-scoped application stages, role-map evidence gaps, and repeated interview coaching improvements with a regression test. Records are not linked to the same opening or actual hiring outcome, and no persisted skill-to-proof sprint workflow exists.
5. **The 25/40/60-minute target is pacing guidance rather than a hard stop. — Clarified.** The UI now labels it as a target, displays elapsed/target time, and stores elapsed time. Sessions are not forcibly ended at the target.

## Review disposition

No claim of a bug-free or production-ready system is warranted. The highest-risk code-level defects fixed in this pass have regression tests; remaining security/release risks are listed above and in the QA audit. Rotate exposed provider keys before further use.


## Independent review addendum ? 2026-11-25

A follow-up inspection found and fixed a race that could let two simultaneous first registrations both adopt the legacy user database, unbounded DOCX ZIP expansion, incomplete formula-prefix handling for VT/FF, and acceptance of compact dates inconsistent with tracker string ordering. Regression coverage and exact reproductions are in [INDEPENDENT_QA_SECURITY_AUDIT.md](./INDEPENDENT_QA_SECURITY_AUDIT.md). The independently rerun backend suite passes 31 tests. Remaining production blockers include no Playwright suite, Docker unavailable for build validation, absent foreign-key migration, distributed rate limiting, and unverified live integrations.

## Workflow increment addendum — 2026-11-25

- **High, fixed for the tested path:** new accounts could call workspace endpoints before completing a career profile. An authenticated API gate now checks persisted profile completion; profile completion itself and logout remain accessible. Tests cover the incomplete-to-complete transition, saved drafts, restart persistence, legacy complete-profile backfill, and isolation.
- **Medium, fixed for the implemented path:** role analysis had no durable user review record. Added per-account resume-review persistence and candidate decisions/notes, with strict payload and item validation, deletion, and cross-account regression tests. A mocked AI response claiming evidence without an exact resume phrase is downgraded to `Needs review` pending candidate confirmation.
- **Remaining scope:** this is not yet a full resume editor. It does not generate replacement bullets/diffs, tailored resumes, or DOCX/PDF output. It stores the supplied resume and JD in that user's SQLite file until the review is deleted; no retention scheduler exists.
- **Verification:** API suite and temporary-account browser smoke cover onboarding and review save/reopen. No automated DOM/Playwright suite was added; Docker, live AI and accessibility conformance remain unverified.

## Resume editing/export increment addendum — 2026-11-25

- **Medium, implemented and API-tested:** saved reviews can now produce line-scoped AI suggestions when configured or a clearly labeled manual editing fallback. Edits require explicit candidate confirmation to accept changed text, are stored separately from the original, can be rejected/restored, and yield a separately persisted approved resume.
- **Medium, implemented and API-tested:** finalized copies export as DOCX, PDF, or TXT, with role/profile-derived filenames restricted to safe ASCII characters. Account isolation and changed-claim confirmation are regression-tested. PDF formatting uses Unicode-capable fonts when available and automatic page flow with margins.
- **Remaining risk:** the workflow cannot prove candidate statements are truthful; confirmation is a user attestation, not independent verification. The browser editor has not been exercised by Playwright or a browser smoke after this increment. Live AI output quality and provider privacy/retention remain unverified.
- **Verification:** `python -m pytest -q` passes 39 tests; `py_compile`, `node --check`, and the date regression pass. Generated DOCX and PDF exports are opened with `python-docx` and `pypdf`. Docker build is blocked by package-index network access and Playwright browser launch is blocked by missing OS Chromium libraries. Live provider and accessibility conformance remain unverified.

## Phase 3 release review — 2026-11-25

- **Browser verification: Passed.** Playwright completed onboarding, role analysis, saved resume review, candidate-approved edit, PDF download, reload persistence, mobile overflow, anonymous API rejection, and logout.
- **Security review: No newly reproduced cross-account or export authorization defect found.** Account-scoped SQLite records, bearer signature/expiry/revocation checks, upload limits, DOCX expansion bounds, formula-safe CSV, prompt-untrusted-data instructions, no-store exports, and sanitized filenames remain in place.
- **Remaining security blockers:** bearer tokens in browser storage are vulnerable to script injection; the production browser session should use HttpOnly cookies or an equivalent stronger design. Distributed rate limiting, account recovery, HTTPS, CSP hardening, malware scanning, retention controls, and production audit logging remain required.
- **Docker review:** Compose syntax passes. The image build is blocked by container access to PyPI, which times out even though the host can reach PyPI. Dockerfile pip retry/timeout settings were added; final image startup and containerized export smoke remain unverified.
