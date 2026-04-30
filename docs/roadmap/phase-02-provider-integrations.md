# Phase 02: Provider Integrations

## Status

Planned.

## Scope

- Implement Azure Speech provider for Sinhala STT/TTS.
- Implement OpenAI tutor provider for structured tutor turns.
- Add provider fallback behavior and latency logging.
- Add cost controls for token and audio usage.
- Add opt-in storage for audio samples with deletion support.

## User Stories Targeted

- FR-2: Real-Time Sinhala Conversation.
- FR-4: English Live Captions.
- FR-5: Pronunciation Feedback.
- FR-7: Adaptive Tutor Persona.
- FR-11: Safety, Privacy, And Consent.

## Testing Expectations

- Contract-test provider adapters with mocked responses.
- Keep live provider smoke tests separate from default `npm test`.
- Never require provider credentials for the default test suite.

## Risks

- Sinhala STT quality may vary across accents and microphone setups.
- Sinhala TTS voice quality must be validated with native speakers.
- Pronunciation feedback must remain humble and confidence-aware.
