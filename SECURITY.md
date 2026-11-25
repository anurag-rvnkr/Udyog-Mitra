# Security notes — CareerOS 0.2

- Private API routes require a signed, time-limited bearer token.
- Each login token has a unique random token ID, so repeated logins within the same second do not produce the same token.
- Responses set a Content Security Policy that restricts scripts to same-origin, blocks objects/frames, and permits configured provider/font connections. Inline styles remain allowed because the current HTML uses style attributes; replace these with CSS classes before removing that exception.
- Permissions Policy allows same-origin microphone access for voice practice and disables camera, geolocation, and payment capabilities.
- Logout revokes the submitted token by storing its SHA-256 hash and expiry in `accounts.db`; the schema is created additively. Other issued tokens remain valid, and expired revocation entries are cleaned up opportunistically.
- User data is isolated into a distinct SQLite file selected from the verified account ID; IDs are not accepted from request payloads to choose the data file.
- Passwords are hashed using PBKDF2-HMAC-SHA256 with 310,000 iterations and random per-user salts.
- The signing key is `CAREEROS_SECRET_KEY`. If unset, a temporary random key is generated at startup and all sessions invalidate after restart. Set a high-entropy persistent secret in deployment.
- API provider credentials remain server-side. Realtime uses a provider-issued ephemeral client secret in the browser.
- Uploaded resumes are limited to 8 MB. This prototype does not virus-scan uploads or automatically delete retained resume/session data.
- Credential throttling is local process memory. Production must use shared rate limiting, HTTPS, secure cookies or a hardened identity provider, account recovery, email verification, logging/monitoring, backup and deletion controls.
- API request bodies are capped before routing (512 KiB generally, 9 MiB for multipart resume uploads; the parsed resume file itself is capped at 8 MiB). Auth and application write payloads use strict Pydantic schemas; other JSON endpoints still need equivalent schemas and field limits.
- Swagger and OpenAPI are disabled unless `CAREEROS_ENABLE_API_DOCS=1` is explicitly configured. Do not enable them on a public deployment unless protected by trusted access controls.
- Interview answers and reports are checkpointed in the account database; transcript/resume fields are sensitive personal data. Account-wide resume/interview retention and deletion controls are not implemented.
- Application CSV exports neutralize spreadsheet formula prefixes and are returned with `Cache-Control: no-store`.
- Realtime voice streams to the configured provider; browser permission and provider data handling apply. Confirm provider policies before using sensitive documents.
- This is an upgraded working prototype, not a security audit or production SaaS certification.
