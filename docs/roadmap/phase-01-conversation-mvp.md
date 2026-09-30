# Phase 01: Free Practice Validation

## Status

Free-practice software is implemented. Automated checks and browser flow checks accompany the handoff. Real microphone quality and fluent-speaker review remain human validation tasks.

## Completed Scope

- Zero provider spending by default, even if keys exist in the environment.
- Five topics with three saved questions, completion, restart, and next topic.
- Search/filter/select all 38 existing phrases, without inventing translations for arbitrary English.
- Preserve the question and conversation target across English rescue.
- Typed input and self-practice remain available without microphone recognition or installed Sinhala playback.
- Microphone cancellation, start errors, empty results, and denied permissions recover gracefully.
- Transcript similarity preserves Sinhala vowel marks and never claims phoneme grading.

## Owner Checks Remaining

1. In Chrome on the primary computer, speak a Sinhala reply and check the transcript.
2. Practice the same phrase with the microphone; assess whether recognition is useful for your accent.
3. Deny/re-enable microphone permission and verify typed practice remains usable.
4. If Chrome has a Sinhala voice, judge normal/slow playback. No paid voice setup is required.
5. Have a fluent colloquial Sinhala speaker review the existing content and romanization.
6. Note specific missing phrases as text for a future content pass.

## Deferred

Open-ended model conversation, Azure account setup, dedicated speech-to-text evaluation, phone HTTPS setup, and new content beyond the existing phrase set.
