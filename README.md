# CareerOS 0.2 — Evidence-driven Career Intelligence

CareerOS is a personal career command center: job discovery, resume/JD evidence mapping, application follow-up tracking, recruiter outreach, portfolio case studies, and interview practice. This upgrade adds account authentication, account-level database isolation, optional AI provider integration, a WebRTC realtime speech-to-speech interview, stronger job-feed matching, and container deployment files.

## Run locally (Windows / macOS / Linux)

Python 3.10+ is required.

```bash
python -m venv .venv
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

On Windows, if `python` points to an older interpreter, use `py -3.13 -m venv .venv`, activate it, then run `python app.py` from the activated environment.

Open `http://127.0.0.1:8000`. Create an account on the first screen. Each account's application/profile/interview data is stored in its own SQLite database. The first account can adopt a legacy `careeros.db` from v0.1 if one is present.

## Configure AI and realtime voice

Copy `.env.example` to `.env`, set a strong unique `CAREEROS_SECRET_KEY`, and add your provider credentials. The native Python launcher does not automatically load `.env`; export variables in your shell or use Docker Compose (which loads `.env`). Never put API keys in frontend code or commit them.

- `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`: context-aware role analysis, career drafts, and answer coaching through an OpenAI-compatible Chat Completions endpoint.
- `OPENAI_API_KEY`: enables the live speech-to-speech interview. The backend creates a short-lived Realtime client secret; the long-lived API key remains server-side.
- `REALTIME_MODEL` and `REALTIME_VOICE`: optional provider model/voice overrides. Check current account model access and provider API docs if you change defaults.

Without credentials, standard 25-question practice and local transparent coaching remain usable. Live realtime interview will show a clear configuration message.

Standard question generation uses the local role blueprint when `AI_API_KEY` is unset. When configured, CareerOS requests exactly 25 role-specific primary questions and can ask a limited number of evidence-grounded adaptive follow-ups. Follow-ups are tracked separately from the 25 primary questions. The interview type, difficulty, target duration, elapsed time and progress checkpoints are saved. Duration is a pacing guide with a visible elapsed timer; the session does not cut off an answer when it is reached. Interrupted turn-based sessions can be resumed from interview history. The local blueprint does not generate adaptive probes.

The application tracker stores interview date, recruiter name/email and job description as well as company, title, status, priority, applied/follow-up dates, next action and notes. Existing account databases receive additive columns on access; no database reset is required. CSV export is account-scoped and prefixes spreadsheet formula cells as text.

The career profile includes free-text fields for education, certifications, achievements, project descriptions and work preferences. These values can be combined with resume text as evidence for career analysis, drafts and interview setup. Keep candidate claims accurate and review every generated draft before use.

The **Evidence graph** screen stores user-entered skills, projects, experience, education, certifications, achievements and professional links with an optional supporting URL and an explicit user-confirmed verification flag. An analyzed job's requirements can be saved as a role map and manually linked to evidence. Portfolio case-study drafts can be saved, reopened, edited, deleted, and optionally linked to a project evidence item from the same account. These records are stored in each account's SQLite database. Evidence links do not yet incorporate application/interview outcomes, and portfolio case-study content is editable text rather than a validated multi-section schema.

Signing out calls the private logout API, which records a hash of the submitted bearer token and expiry in `accounts.db`. The token is rejected on later requests, including after a service restart. Other sessions created by a separate login remain active.

## Realtime voice interview

Use **Start live AI voice interview** in the interview area, after pasting the real JD and resume/project evidence. The browser requests microphone permission and establishes a WebRTC audio session with the provider. The live interviewer can ask, listen, follow up, and coach conversationally; it is distinct from the existing browser speech-recognition, turn-by-turn 25-question mode. A captured transcript is saved to private session history when available. Transcript capture depends on provider transcription events and should be reviewed for errors.

Voice audio is sent to the configured speech provider. Use only information you are comfortable sharing with that provider, and review its current retention/privacy terms. CareerOS does not promise that a third-party provider's speech services are local-only.

## Job discovery

Search scans multiple pages of the Arbeitnow public job-board feed and supplements short/remote searches with Remotive remote listings; it uses partial-term matching, ranking and deduplication. Feed listings are unverified third-party data, may be stale, and do not guarantee fresher eligibility. Verify the employer, vacancy, location, application deadline, and job details at the source. Network/feed failures are surfaced rather than interpreted as zero jobs.

## Docker deployment

```bash
cp .env.example .env
# Edit .env: set CAREEROS_SECRET_KEY and provider keys as needed
# Ensure CAREEROS_ALLOWED_ORIGINS includes the actual trusted frontend origin.
docker compose up --build -d
```

The service binds to `127.0.0.1:8000` on the host and persists SQLite files in a named Docker volume. Put a maintained HTTPS reverse proxy in front for remote access. Do not expose the app directly to the internet.

## Security status / remaining production work

Implemented in this version: email/password registration and login; PBKDF2-SHA256 password hashing with per-user random salts; signed expiring bearer tokens; separate SQLite file per account; authentication required for private API routes; basic credential-attempt throttling; response security headers; server-side provider secrets; upload size limit; Docker non-root process and persistent volume.

Still required before a public multi-user SaaS launch: email verification and password reset, token revocation/refresh, secure HttpOnly-cookie or stronger browser token strategy, distributed rate limiting/WAF, HTTPS and a restrictive production CSP, database backups/restore tests, retention/deletion controls, audit logs, malware scanning for uploads, automated end-to-end browser tests, monitoring, and provider-specific privacy/compliance review. Current login throttle is in-process and resets on restart; it is not a substitute for a production identity service or edge rate limiter.

## Tests

```bash
py -3.13 -m pytest -q
node tests/test_frontend_date.js
py -3.13 -m py_compile app.py
node --check app.js
```

API docs are disabled by default. Set `CAREEROS_ENABLE_API_DOCS=1` only in a trusted development environment to expose Swagger/OpenAPI routes.

The current automated suite covers authentication and account isolation, application/profile/evidence/portfolio/role-map CRUD and validation, resume upload rejection and TXT parsing, local analysis and provider errors, interview question count and report persistence, draft types, and response headers. The independent audit records the latest test run and limitations in [QA_SECURITY_AUDIT.md](./QA_SECURITY_AUDIT.md). Live provider WebRTC, live AI output, public job feeds, deployment, browser microphone permissions, and backup recovery still require configured external services or infrastructure.
