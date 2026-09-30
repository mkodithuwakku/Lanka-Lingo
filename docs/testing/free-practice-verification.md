# Free Practice Verification — 2026-09-12

## Result

The limited free version is implemented and passed the software checks below. No OpenAI or Azure account was configured and no paid provider calls were made. The development server was launched with `ENABLE_PAID_SERVICES=false`.

## Checks Passed

- `npm test`: 20 tests passed.
- `npm run check`: TypeScript passed.
- `npm run build`: production build passed.
- Browser: page rendered with no framework overlay or browser errors.
- Free conversation, phrase search/selection, English rescue, and round navigation made zero `/api/tutor` or `/api/speech` requests.
- Browser flow: select the second suggestion and update the target; answer; enter English help; select a known phrase; reject a negated/unknown sentence as an exact translation; return to the same question and target; finish; restart; next topic; custom-topic disclosure.
- Phrase library: search, filter to six Food replies, recover from empty results, select a phrase.
- Desktop (1280 px wide) and mobile (390 x 844): visually inspected; no horizontal overflow. Desktop composer stays visible in the conversation panel.
- With the network disabled after loading, phrase selection and typed conversation continued to work. This does not establish offline microphone support or offline reload/install support.
- Direct server requests: free tutor returned 200/local; null history entry and negative step returned 400; null speech body returned 400; valid Sinhala speech request returned 503/speech_not_configured without synthesis.

## Simulated Speech Checks

Browser speech interfaces were replaced temporarily with test doubles. Checks covered Sinhala/English recognition locale, denied permission, empty recognition, synchronous start failure, stop cancellation, mode-switch cancellation, matching transcript feedback, voice-list changes, Sinhala-only voice selection, slow rate, and stopping playback before recognition. Unavailable recognition also preserved typed input. No real microphone audio was recorded by these checks.

The first synthesis simulation used a plain object where Chrome requires a native SpeechSynthesisVoice instance. The test harness was corrected to simulate the utterance interface as well, then all 14 speech assertions passed. This is behavior verification, not evidence of real synthesized pronunciation quality.

## Still Requires Owner/Fluent-Speaker Review

- Actual microphone recognition of the owner's Sinhala and accent.
- Audible quality of any installed Sinhala voice.
- Naturalness and correctness of the existing Sinhala phrases and romanization.

Paid-provider setup, live model evaluation, and Azure synthesis testing are deferred by request.
