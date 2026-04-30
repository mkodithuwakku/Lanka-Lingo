# Phase 01: Conversation MVP

## Status

Planned.

## Scope

- Implement authenticated or anonymous learner sessions.
- Build guided conversation UI with hold-to-speak controls.
- Display English captions and romanized Sinhala suggestions.
- Store progress events and session reviews.
- Add privacy settings UI for audio retention and transcript handling.
- Add internal scenario/content editor or structured seed-file workflow.

## User Stories Targeted

- FR-2: Real-Time Sinhala Conversation.
- FR-3: Suggested Things To Say.
- FR-4: English Live Captions.
- FR-6: Conversation-Based Progression.
- FR-8: Scenario Library.
- FR-9: Conversation Review.
- FR-11: Safety, Privacy, And Consent.

## Testing Expectations

- Add browser-level tests once UI routes become interactive.
- Keep domain acceptance tests fast and provider-free.
- Add fake speech-provider tests for quiet audio, low confidence, and retry flows.

## Risks

- Browser microphone behavior may vary by platform.
- Latency expectations must be validated with real provider calls.
