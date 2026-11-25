# Architecture

## Runtime

- `app.py`: FastAPI middleware, account registration/login, provider calls, job feeds, resume parsing, profile, application and interview APIs.
- `index.html`, `styles.css`, `app.js`: single-page browser client. Authenticated API requests use a signed bearer token held in browser local storage.
- SQLite: separate `careeros_<opaque-user-id>.db` per account; `accounts.db` stores credentials. Existing schema upgrades are additive on database access.
- Docker: one app process with SQLite persisted in a named volume.

## Data and trust boundaries

Private routes require a valid signed token. Middleware sets the account scope, and DB path selection uses its opaque subject. Application, profile, interview, and evidence rows therefore live in that account's database. Uploaded resumes are parsed by the backend and are not persisted as uploaded files. Third-party job data is labeled and should be verified at source. AI and realtime providers receive supplied career context when enabled.

All API/static responses receive security headers including a Content Security Policy. Scripts are same-origin; style attributes remain temporarily allowed due to current markup. The application requires microphone permission for voice features.

Evidence records store type, title, details, user-entered provenance, an explicit verified flag, supporting links, and timestamps. Saved role maps contain the JD and requirements returned by analysis; users explicitly link requirements to evidence rows through a join table. AI match labels remain suggestions. Portfolio case studies are stored separately with a title, editable content, optional project-evidence ID, and timestamps. All IDs are resolved within the current account database, and deleting evidence removes its role links and clears portfolio references.

## Stack decision and migration path

The requested React/TypeScript and PostgreSQL stack is not present. Retaining the functioning stack is justified for this bounded repair because replacing UI and storage together increases risk to existing workflows and legacy SQLite data. This decision does not meet the requested target stack. A future migration should define API contracts and normalized SQLAlchemy models, then add Alembic revisions and an import that validates each user's rows/counts before switching traffic. Never reset account databases during migration.

## Production boundaries

Bearer tokens are stored in local storage, throttling is process-local, and email recovery is absent. Logout revokes the token hash in the shared auth database. Deploy only behind HTTPS and a trusted reverse proxy while these limitations remain. Keep provider credentials server-side and set stable signing/origin configuration through deployment secrets.
