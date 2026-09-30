# Testing

## Automated Checks

```bash
npm test
npm run check
npm run build
```

The default tests use Node's TypeScript runner, require no credentials, and make no network requests. Coverage includes:

- Retrieval of every phrase by its displayed English meaning.
- English helper framing, rejected partial/negated matches, and clearly labeled unknown-sentence alternatives.
- Search by English, Sinhala, and romanization; topic filters and empty results.
- Guided question progression independent of truncated history or English-help messages, completion and restart.
- Generic custom-topic disclosure and deterministic daily topics.
- Provider credentials alone cannot enable billed calls.
- Sinhala vowel marks affect transcript similarity; punctuation/joiners do not.
- Speech markup escaping, playback-rate bounds, and allowed Sinhala voices.

## Browser Regression Flow

With `ENABLE_PAID_SERVICES=false`:

1. Load the page. Confirm Free practice, Question 1 of 3, and no `/api/tutor` or `/api/speech` requests.
2. Choose each suggested answer in turn; both must update the input and phrase target. Send one and advance exactly one question.
3. Open English help, search/filter, select an included sentence, and check all three text representations. Try an unknown sentence and confirm the persistent alternative-phrase explanation.
4. Return to Sinhala. Confirm the question number and conversation practice target are preserved. Finish the round, restart, and use Next topic.
5. Change to a custom topic and confirm the generic-prompt explanation.
6. With no Sinhala voice, playback and auto-play are disabled, while text and microphone practice remain independently usable.
7. Test 390 px mobile and desktop layout, keyboard focus, and no framework error overlay or browser errors.
8. Call tutor/speech routes directly with free configuration and verify no cloud synthesis. Malformed JSON/null history entries and invalid steps must return 400, not crash.

See [the latest free-practice verification record](./free-practice-verification.md) for observed results and their limits.

## Real-Device Checks

Automation can simulate speech API events but cannot establish microphone quality, installed voice pronunciation, or natural Sinhala content. The owner should:

- Grant and deny microphone permission in Chrome.
- Speak a reply and a focused practice phrase; inspect recognized Sinhala and the word-match result.
- Stop microphone mid-attempt; switch modes/topics while listening; no canceled result should be submitted.
- If an installed Sinhala voice exists, test Listen, slow playback, Stop audio, and recording after playback.
- Confirm recognition failure/empty audio leaves typed input usable.

## Content Review

The library reuses existing content; it is not newly certified or fluent-speaker-approved. A fluent colloquial Sinhala speaker should verify phrasing, meanings, and romanization before long-term study.

Paid-provider verification is deferred. Any future live tests must be separate from `npm test` and require explicit provider opt-in.
