# Phase 00: Foundation

## Status

In progress.

## Scope

- Create mobile-first PWA scaffold.
- Create domain types and deterministic services for the core learning loop.
- Add privacy-first audio retention defaults.
- Add romanized Sinhala support to phrase and suggestion models.
- Add multiple-speaker colloquial review gate.
- Add acceptance-aligned test suite.
- Add architecture, Codex context, roadmap, and testing documentation.

## User Stories Covered

- FR-1: Onboarding And Placement.
- FR-3: Suggested Things To Say.
- FR-5: Pronunciation Feedback.
- FR-6: Conversation-Based Progression.
- FR-9: Conversation Review.
- FR-10: Vocabulary And Phrase Memory, partially through phrase fixtures and review.
- FR-11: Safety, Privacy, And Consent.
- FR-12: Admin Content Management, partially through content review gates.

## Acceptance Tests

See `tests/acceptance/*.test.ts`.

## Open Follow-Ups

- Persist learner/session state.
- Connect UI controls to the service layer.
- Add live speech and LLM providers.
- Expand scenario content beyond starter fixtures.
