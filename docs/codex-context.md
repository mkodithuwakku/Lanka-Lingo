# Codex Context

This file is the fast handoff for new Codex instances.

## Product Direction

Lanka Lingo teaches Sinhala through AI-guided spoken conversation. The first release is a mobile-first web/PWA, not native apps. The product is for adults, uses colloquial spoken Sinhala, includes romanized Sinhala prominently, and excludes reading/writing curriculum.

## Key Product Decisions

- Mobile-first responsive web/PWA first.
- Colloquial spoken Sinhala over formal literary Sinhala.
- Romanized Sinhala is first-class because many speakers type Sinhala with Latin letters.
- Raw learner audio storage is off by default and opt-in only.
- Multiple Sinhala speakers must review colloquial phrasing before public release.
- Older children may use the product, but adults are the target audience.

## Current Code Shape

- `SPECIFICATION.md`: source of truth for user stories and acceptance cases.
- `app/`: Next.js PWA shell.
- `src/domain/types.ts`: shared types.
- `src/content/scenarios.ts`: initial scenario and phrase fixtures.
- `src/services/conversationEngine.ts`: high-level turn orchestration.
- `src/services/onboarding.ts`: learner placement and profile creation.
- `src/services/privacy.ts`: audio-retention defaults and toggles.
- `src/services/pronunciation.ts`: MVP pronunciation heuristics.
- `src/services/suggestions.ts`: romanized suggested replies.
- `src/services/contentReview.ts`: multiple-speaker review gate.
- `tests/acceptance/`: tests that map to specification acceptance cases.

## How To Work Here

Run:

```bash
npm test
```

Do not add live Azure/OpenAI credentials to the repo. Provider integrations should be implemented behind interfaces in `src/providers/` and tested with fakes.

## Next Best Tasks

1. Add persistence abstractions for learner profiles, sessions, progress events, and scenario content.
2. Add an OpenAI tutor provider interface that returns the structured tutor response contract from the spec.
3. Add real Azure Speech integration behind `SpeechProvider`.
4. Extend the PWA UI to call the domain services through server actions or API routes.
5. Expand acceptance tests each time a user story is implemented or changed.
