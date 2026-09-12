# SurakshaNet route table

Server functions (TanStack `createServerFn`) plus public pages.
Auth = Better Auth session. Anonymous routes capture **no** IP / email / device.

| Method | Route / fn | Auth | Description |
| --- | --- | --- | --- |
| GET | `/` | public | Child-facing home, 1-tap safe exit |
| GET | `/report` | public | Anonymous report (emoji-style severity, optional text/voice/screenshot) |
| POST | `submitAnonymousReport` | none | Ingest → score → case. Returns `publicId` only |
| GET | `/report/done?id=` | public | Confirmation + Childline 1098 |
| GET | `/help` | public | Persistent 1098 |
| GET | `/exit` | public | History overwrite + decoy redirect |
| GET | `/detect` | public | Labeled synthetic classifier demo |
| GET | `/privacy` | public | DPDP + POCSO notes |
| GET | `/login` | public | Google, X, email/password |
| GET/POST | `/api/auth/$` | Better Auth | Session |
| GET | `/console` | staff | P1–P4 queue, SLA, overdue |
| GET | `/console/cases/:id` | staff | Evidence, explainability, notes |
| POST | `transitionCase` | staff | Status machine; confirm on escalate/close |
| POST | `addNote` | staff | Internal note |
| POST | `revealIdentity` | staff (not NGO) | Unseal callback number, logged |
| GET | `exportSafetyPack` | staff | Simulated POCSO JSON |
| POST | `ingestDemoThread` | staff | Pipeline lab |
| GET | `/console/analytics` | staff | Region / lang / risk aggregates |
| GET | `/console/audit` | staff | Immutable audit log |
| GET | `/console/settings` | staff | Scoring weights, retention, RBAC |
| POST | `updateScoringConfig` | admin | Weight change, no auto-retrain |
| POST | `purgeDueCases` | admin + confirm | Retention purge |
| GET | `/console/architecture` | staff | Diagram + this table |

Python NLP (split deploy): `POST /classify`, `/detect_language`, `/extract_flags`, `/explain`, `/draft_safety_case`.
