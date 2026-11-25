# Independent QA and application security audit

Date: 2026-11-25. Scope: current FastAPI/SQLite/vanilla-JS checkout, regression tests, Docker files, and safe release configuration. I did not inspect or print `.env` values or local databases.

## Findings fixed in this pass

| Severity | File and location | Reproduction and root cause | Fix and evidence |
|---|---|---|---|
| High ? privacy/data isolation | [app.py](./app.py:234), registration and legacy database adoption | With an empty auth database and a legacy single-user `careeros.db`, synchronize two `/api/auth/register` calls after each has checked the user count. Both can observe zero and each copy the legacy database into its own account DB. | `BEGIN IMMEDIATE` now serializes the zero-user check with the insert; the password hash is computed before taking the write lock. [test_api.py](./tests/test_api.py:421) uses a two-thread barrier and verifies exactly one new account receives the legacy row. |
| High ? availability / resource exhaustion | [app.py](./app.py:605), DOCX archive validation; [app.py](./app.py:630), upload parser | Authenticated user uploads an 8 MiB-or-smaller DOCX ZIP with a highly compressible or oversized member. The old flow passed it directly to `python-docx`, allowing disproportionate decompression and memory/CPU use. | Rejects excessive member count, declared and actual expansion, per-member size, and compression ratio before document parsing. [test_api.py](./tests/test_api.py:412) covers a compressed expansion vector and confirms a bounded 415 response. |
| Medium ? spreadsheet formula injection | [app.py](./app.py:335), CSV cell neutralization | Save a cell beginning with vertical-tab or form-feed followed by `=...`/`@...`, export CSV, then open it in a spreadsheet. The prior prefix scan omitted those whitespace controls. | Added VT/FF to prefix detection and neutralization. [test_api.py](./tests/test_api.py:253) includes the export regression plus direct prefix assertions. |
| Medium ? date integrity and reminders | [app.py](./app.py:354), tracker date validation | POST an application with `follow_up_date: "20261210"`. Python accepts this compact ISO variant, despite the API promising `YYYY-MM-DD`; UI comparisons and sorting expect fixed-width dates. | Requires the parsed date to round-trip to the exact `YYYY-MM-DD` string. [test_api.py](./tests/test_api.py:181) asserts compact form is rejected. Existing Node local-date boundary test passes. |

## Security and workflow review

- **Authentication/authorization:** PBKDF2 password hashing, signed expiring bearer tokens, logout revocation, and per-IP process-local throttling are present. Private API routes are gated in [account_scope](./app.py:120). Cross-account application, evidence, portfolio, role-map, interview, and outcome isolation are covered by API tests. The concurrent first-registration migration race was fixed above. Process-local throttling is not adequate for multiple workers or proxy deployments.
- **Resume upload:** request size is bounded by middleware, parser accepts PDF/DOCX/TXT/MD, and DOCX decompression is now bounded. Tests cover TXT, mismatched/invalid PDF, and DOCX compressed expansion. PDF parser complexity and broad multi-upload concurrency have not been load-tested.
- **AI provider:** timeout, HTTP 429, malformed JSON, and incomplete structured output have mocked regression coverage. No live provider credential was exercised; output quality, provider retention, cost controls, and external outage behavior remain unverified.
- **Interview persistence/recovery:** tests cover account-scoped history, restart persistence, in-progress update, and primary/follow-up accounting. Prior interactive smoke claims were not treated as independent evidence in this pass; there is no checked-in automated browser suite.
- **Application tracker/CSV:** CRUD, validation, account isolation, export, formula-prefix defenses, and follow-up date format have automated tests. Reminder calculations remain frontend-derived; timezone regression coverage exercises the local date helper rather than browser time zones in a full UI.
- **Database:** schema migration tests preserve legacy interview rows. Tables such as `role_requirements`, `requirement_evidence`, and portfolio links do not declare SQLite foreign keys in [db](./app.py:173); deletes are manually coordinated. A failed multi-step mutation could leave inconsistent links, and there is no tested foreign-key-enabling migration. Some routes close connections on their success path rather than consistently in `finally`; broad failure-path cleanup remains.
- **Frontend:** JavaScript syntax and the date helper test pass. No checked-in Playwright package or end-to-end suite exists, so navigation, keyboard-only use, async failure states, and real responsive interaction were not independently exercised in this run.
- **Deployment:** [Dockerfile](./Dockerfile:1) uses a non-root user and [docker-compose.yml](./docker-compose.yml:4) binds the published port to loopback and persists `/app/data`. Docker/Compose is not installed here, so config parsing and image build were not run. Compose requires a local `.env`; a stable session secret and HTTPS-terminating reverse proxy are deployment requirements. Compose has no health check or backup/restore procedure.
- **Secrets and packaging:** `.env` exists and is ignored, but I did not inspect its values. `.env.example` contains placeholder values. Git is unavailable, so current tracking state and history cannot be checked; rotate any previously exposed credentials and verify/rewrite history using a trusted Git environment.

## Verification performed

- `py -3.13 -m pytest -q`: **31 passed**, one upstream `python_multipart`/Starlette pending-deprecation warning (35.33 seconds).
- Targeted regression run before the full suite: **4 passed, 27 deselected** for DOCX expansion, simultaneous first registration, strict dates, and CSV formula prefixes.
- `py -3.13 -m py_compile app.py`: passed.
- `node --check app.js`: passed.
- `node tests/test_frontend_date.js`: passed.
- Docker/Compose commands and build: not run; Docker executable unavailable. Git inspection: not run; Git executable unavailable.

## Release-readiness assessment

**Not ready for public production deployment.** The high-severity defects found in this pass have bounded fixes and regression coverage, but live AI/voice/feed integrations, Docker build, automated browser testing, database FK migration/integrity, distributed rate limiting, backup/restore, and production proxy/TLS behavior remain unverified or incomplete. No claim of bug-free behavior is warranted.
