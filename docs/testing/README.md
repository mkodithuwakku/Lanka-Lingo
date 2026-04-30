# Testing Documentation

## Test Philosophy

The test suite follows the user stories and acceptance criteria in `SPECIFICATION.md`. Tests should prove learning behavior, privacy behavior, and release gates without requiring live AI or speech credentials.

## Running Tests

```bash
npm test
```

The suite uses Node's built-in test runner and TypeScript stripping available in Node 23.6+.

## Current Test Layers

- Acceptance/domain tests: `tests/acceptance/*.test.ts`.
- Provider tests: planned; should use fake providers by default.
- Browser/UI tests: planned after the PWA conversation routes become interactive.

## Acceptance Mapping

- `onboarding.test.ts`: FR-1 onboarding and placement.
- `conversation.test.ts`: FR-2, FR-3, FR-5, FR-6, and FR-9 core conversation behavior.
- `privacy.test.ts`: FR-11 privacy and opt-in audio retention.
- `content-review.test.ts`: FR-12 content review and multiple-speaker colloquial release gate.
- `scenario-library.test.ts`: FR-8 initial scenario requirements.

## Rules For Updating Tests

- Add or update tests when a user story changes.
- Keep default tests deterministic and offline.
- Do not call Azure, OpenAI, or any network provider in `npm test`.
- Use provider fakes for low confidence, quiet audio, retry, and success paths.
- Keep each test name tied to product behavior, not implementation trivia.
