# Constraints And Open Decisions

## Current Constraints

### Pronunciation accuracy

The app can measure whether speech recognition produced text similar to the target sentence. It cannot isolate a wrong Sinhala sound, explain tongue placement, or reliably grade accent and vowel length. A transcript match is useful confirmation, but it is not a pronunciation certificate.

### Browser speech support

`SpeechRecognition` is not a uniform web standard in practice. The prototype therefore supports Chrome only. `si-LK` recognition quality, network use, permissions, and response confidence can still vary between Chrome platforms. Typed input is the guaranteed fallback.

### Text-to-speech voice quality

Chrome often exposes no Sinhala system voice. Passing `si-LK` without selecting a real Sinhala voice can cause an English voice to skip the script and read only punctuation. The app now blocks that behavior. Free practice uses only an installed Sinhala browser voice. When none exists, playback controls are disabled and self-practice remains available. Optional Azure synthesis is deferred until the owner chooses to enable paid services.

### Local is not necessarily offline

The Next.js app and its state run locally. Browser recognition may use a browser-vendor server, the optional tutor calls OpenAI, and reliable phrase synthesis calls Azure Speech. Fully offline Sinhala recognition, synthesis, and open-ended conversation are not included.

### Sinhala language quality

Models and seed phrases can produce understandable but overly formal, contextually odd, or culturally unnatural Sinhala. The starter content and prompt should be reviewed by a fluent speaker familiar with the variety the owner wants to learn.

### Bilingual wake phrase

The current browser recognizer listens in one locale at a time. The app therefore provides a one-tap English switch rather than reliably detecting an English interruption while recognition is configured for Sinhala.

## Resolved Product Decisions

1. Use neutral everyday colloquial Sinhala because it is the least specialized starting point.
2. Model the owner as a heritage learner with full comprehension and limited sentence retrieval.
3. Teach one casual recommended phrase in English rescue mode.
4. Discard conversations on refresh; no persistence is needed.
5. Support Chrome only. Keep the responsive web app rather than adding native packaging.
6. Keep the conversation moving through a daily topic, presets, or a custom topic supplied at session start.
7. Use Azure Speech for optional Sri Lankan Sinhala synthesis because it explicitly supports `si-LK-ThiliniNeural` and `si-LK-SameeraNeural`; do not use OpenAI TTS or an English browser fallback for Sinhala.

## Free Practice Decisions (September 2026)

- No provider spending for the current phase. Default `ENABLE_PAID_SERVICES=false`; keys alone never enable provider calls.
- Complete the limited product as three-question guided rounds with restart/next-topic actions, not simulated content-aware conversation.
- Reuse the existing 38 Sinhala phrases in a searchable library. Broader Sinhala content remains subject to fluent-speaker review.
- Automatic English lookup uses complete known sentences/aliases. Search can suggest phrases, but never silently translate a partial keyword match.
- Preserve the conversation question and target across English help.
- Keep all session state in memory; do not add accounts, progress storage, or a notebook.

## Remaining Decisions

1. Who can review the Sinhala, synthesized pronunciation, and romanization conventions before they become habitual learning material?

## Deferred Technical Choices

- Dedicated Sinhala speech-to-text provider versus browser recognition.
- Recorded-audio comparison or human-reviewed pronunciation examples.
- Streaming speech-to-speech versus the current turn-based loop.
- Saved history and phrase notebook, unless the owner changes the no-persistence decision.
- HTTPS setup for microphone testing from a phone on the local network.
