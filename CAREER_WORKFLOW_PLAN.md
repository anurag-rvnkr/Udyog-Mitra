# CareerOS workflow implementation plan

## Implemented vertical slices: profile onboarding/logout and resume evidence review

### Existing architecture

FastAPI API, browser-native JavaScript UI, and account-scoped SQLite files. The profile is stored as JSON in the existing per-user `profile` table, so a JSON-compatible profile field can be added without a destructive schema migration.

### Files and implementation

- `app.py`: typed strict profile payload; persist career stage, graduation year, internship/work experience, and an explicit `profile_complete` field; validate completion server-side; add `POST /api/profile/complete`; preserve existing profile reads and writes.
- `index.html`: onboarding overlay with progress, required first-login fields, optional experience/project/certification/link fields, save-progress and save-and-continue actions; explicit account logout in profile.
- `app.js`: load profile before workspace data, gate incomplete accounts, hydrate and autosave drafts, complete onboarding only after backend validation, handle profile errors/retry, and share server-backed logout action.
- `styles.css`: responsive onboarding surface and progress indicator.
- `tests/test_api.py`: strict profile validation, draft persistence, completion requirements, account isolation, completion persistence across client restart.
- `tests/test_frontend_date.js` or a separate dependency-free frontend test: retain syntax-level checks; no DOM test dependency is currently installed.
- `TESTING_REPORT.md`, `PROJECT_STATUS.md`, `IMPLEMENTATION_PLAN.md`, and this plan: record actual evidence and remaining phases.

### Acceptance tests

1. New account GET profile reports incomplete and cannot call completion with missing fields.
2. Draft profile fields persist without marking completion.
3. Invalid career stage, malformed dates, oversized fields, and unexpected fields are rejected.
4. Valid required fields complete onboarding and survive a new TestClient.
5. Another account cannot read or complete the first account profile.
6. Existing complete profile users are not repeatedly prompted; older JSON without a flag is backfilled as complete only if all required evidence exists.
7. UI loads profile before applications/history and provides an accessible save/retry/completion flow.
8. Profile page and account control both invoke server logout revocation and clear local auth state.

### Resume review increment

- `app.py`: additive `resume_reviews` table in each authenticated user's SQLite database; strict create/update schemas; create/list/read/update/delete APIs; report structure and decision IDs validated against saved report content; transaction rollback and account isolation.
- `app.js`: Role Intelligence renders Resume Improvement Intelligence with candidate-review controls; review decisions and notes persist without replacing original resume text; saved reviews can be opened after reload or deleted; loading/error/empty states are shown.
- `tests/test_api.py`: report persistence, decision validation, untrusted status prevention for AI-only claims, strict booleans, and cross-account CRUD isolation.
- The current analyzer report uses local exact phrase matching and a clearly labeled fallback when no AI is configured. Exact phrase matches are not treated as proof of proficiency.
- Browser smoke in an isolated account covered onboarding, role analysis, review save, reload, reopening and restoration of a saved decision.

### Follow-on phases

1. Complete resume/JD intelligence: detailed section-by-section recommendations, source-to-proposal bullet diffs with accept/reject/manual edit, truthful tailored resume assembly, safe filename recommendations, and DOCX/PDF export.
2. Persisted question bank with categorized, evidence-linked practice questions and stable selection.
3. Dedicated recruiter outreach module and persisted drafts (no sending).
4. Full interview-room controls and balanced 25-question session selection.
5. Guided workflow dashboard and linked evidence/outcome model.

Each remaining phase needs its own schema/API/UI/test scope; the completed slices above do not satisfy overall product acceptance.
