# Testing report

Latest verification: 2026-11-25. Includes persisted resume evidence decisions and a candidate-approved resume edit/export workflow. See [QA_SECURITY_AUDIT.md](./QA_SECURITY_AUDIT.md) and [INDEPENDENT_QA_SECURITY_AUDIT.md](./INDEPENDENT_QA_SECURITY_AUDIT.md) for broader requirement-level evidence and remaining risks.

## Automated checks executed

- `py -3.13 -m pytest -q`: **36 passed**, one upstream `python_multipart`/Starlette pending-deprecation warning (49.81 seconds).
- `py -3.13 -m py_compile app.py`: passed after resume edit/export API changes.
- `node --check app.js`: passed after resume edit/export UI changes.
- `node tests/test_frontend_date.js`: passed local-date/UTC-boundary regression.
- Focused resume review/edit run: **2 passed, 34 deselected** after the final resume API/UI changes.
- `docker compose config` and image build: not run successfully; Docker is not installed.
- No packaged frontend unit/E2E suite is present. The outcome-intelligence test verifies application-stage aggregation, evidence-gap aggregation, repeated coaching-gap aggregation, and account isolation.

Independent security regressions added: simultaneous legacy-database adoption, bounded DOCX ZIP expansion, strict YYYY-MM-DD validation, VT/FF-prefixed CSV cells, candidate confirmation before accepting changed resume statements, safe DOCX/TXT export and resume edit account isolation. The API tests cover authentication/revocation, onboarding gate/draft persistence/legacy profile backfill, strict auth/application/review request schemas, body and password limits, throttle memory bounds, cross-account isolation, application CRUD and formula-safe CSV, profile/evidence/portfolio/role-map/resume-review data, resume TXT extraction and invalid PDF rejection, AI fallback/provider errors (timeout, rate-limit and malformed response), AI claim evidence downgrade, exactly 25 generated questions, checkpoint/report persistence and migration, primary-versus-follow-up accounting, API documentation visibility, and release ignore patterns. AI output tests use mocks where specified and do not demonstrate live provider behavior. Resume DOCX export was exercised through the API regression test; the new interactive editor has not had a browser E2E run yet.

## Browser checks executed

The current checkout was served on an isolated temporary port with a fresh temporary database. A disposable account completed onboarding, entered the Role Intelligence flow, ran a local JD/resume analysis, saved a candidate evidence decision, reloaded the app, reopened the review and verified the decision/note restored. Prior browser journeys on isolated temporary databases covered application creation/dashboard count and 25-question interview recovery/reporting; no existing user database was used for these journeys.

Responsive width probes at 390, 834, and 1440 px found no horizontal document overflow in the current checkout. A fresh temporary account also loaded the Outcome Intelligence panel and its honest no-data state; the same 390/834/1440 px probes on that checkout showed no horizontal document overflow. These checks were browser smoke tests, not a reproducible Playwright test suite. The shared port 8002 page had different loaded CSS and was not treated as evidence for the checkout.

## Not verified

Live AI output quality, job feeds, realtime voice/microphone/transcription, public deployment, Docker, backup/restore, email delivery (the application only drafts messages), full keyboard/screen-reader/contrast conformance, or the complete end-to-end journey. A stable provider configuration and external infrastructure are needed for the corresponding live checks.

Detailed independent findings, reproductions, and remaining risks: [INDEPENDENT_QA_SECURITY_AUDIT.md](./INDEPENDENT_QA_SECURITY_AUDIT.md).
