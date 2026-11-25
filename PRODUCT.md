# CareerOS product specification — v0.2

## Product promise
CareerOS turns verified career evidence into role decisions, application actions, interview practice and a continuous improvement loop.

## Core loop: EvidenceLoop
1. Candidate profile and resume/project evidence
2. Job description requirement extraction
3. Requirement-to-evidence mapping
4. Honest application/resume/outreach actions
5. Personalized interview practice (turn-based or live realtime voice)
6. Application and interview outcome tracking
7. Next best action and learning plan

## Implemented modules
- Candidate profile and resume/project evidence
- Application pipeline, follow-up scheduling, next action, priority and CSV export
- Multi-page public job feed scan, partial-term matching, ranking and deduplication
- JD/resume requirement-to-evidence analysis (configured AI or local heuristic)
- Recruiter outreach, resume improvement and portfolio case-study drafts
- 25-question browser voice/text interview with coach and real-interview modes
- Optional WebRTC realtime speech-to-speech interviewer using provider ephemeral credentials
- Realtime transcript capture and private session history where provider events are available
- Email/password account creation and login, signed expiring bearer tokens, per-account SQLite isolation
- Docker packaging, persistent data volume and deployment environment configuration

## 25-question blueprint
- 3 introduction/motivation
- 5 resume/project deep dive
- 7 role/JD technical
- 4 role scenarios
- 4 behavioral/HR
- 2 closing

## Evaluation boundaries
- Local answer feedback is a coaching heuristic, not a validated hiring score.
- AI feedback is contextual but must be reviewed; it should not fabricate candidate experience.
- No evaluation of accent, identity, appearance or speech speed.
- Keyword presence is not proof of skill.
- Live voice is an interactive provider-backed conversation, not the fixed 25-step interviewer; provider availability and configured key are required.

## Remaining roadmap
- Verified multi-source job providers, freshness indicators, and job-alert automation
- Email verification, password recovery, token revocation/refresh and secure cookie/session architecture
- Persistent distributed rate limiting, CSP, HTTPS deployment, audit and monitoring
- Database backup/restore, retention and deletion controls
- Automated browser and real-provider WebRTC end-to-end tests
- Accessibility review, mobile microphone testing and production identity/security audit
