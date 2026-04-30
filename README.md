# Lanka Lingo

Lanka Lingo is a mobile-first web/PWA for learning colloquial spoken Sinhala through AI-guided conversation. The product emphasizes speaking, listening, repair, romanized Sinhala support, and privacy-first voice handling rather than reading, writing, or exam-style checkpoints.

## Quick Start

```bash
npm test
```

The current implementation is dependency-light: the acceptance-aligned domain test suite runs with Node's built-in test runner. The Next.js/PWA surface and AI provider integrations are scaffolded for the MVP but do not require live provider credentials for the tests.

## Key Files

- [SPECIFICATION.md](./SPECIFICATION.md): product specification, user stories, and acceptance cases.
- [docs/architecture.md](./docs/architecture.md): system architecture and provider boundaries.
- [docs/codex-context.md](./docs/codex-context.md): fast project handoff context for future Codex sessions.
- [docs/local-development.md](./docs/local-development.md): how to install, test, and run the project locally.
- [docs/roadmap/README.md](./docs/roadmap/README.md): implementation phases and update rules.
- [docs/testing/README.md](./docs/testing/README.md): testing strategy and acceptance mapping.
- [src/services/conversationEngine.ts](./src/services/conversationEngine.ts): orchestration entry point for the conversation loop.
