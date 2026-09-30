# Phase 02: Optional Speech Upgrades

Current decision: deferred. The owner is completing free practice before purchasing tokens or configuring cloud speech. Existing integrations require `ENABLE_PAID_SERVICES=true` and credentials; keys alone leave them disabled.

## Status

Sinhala synthesis upgrade implemented; recognition upgrades remain deferred until real-device testing proves a need.

## Possible Scope

- Replace browser recognition with a server-side Sinhala speech-to-text provider.
- Compare the implemented Azure `si-LK` voices with fluent-speaker samples and change the default if needed.
- Stream partial transcripts and tutor audio to reduce pauses.
- Evaluate word timestamps or audio similarity only if they produce honest, useful pronunciation feedback.
- Add a provider abstraction after at least two realistic candidates have been tested.

## Guardrails

- Do not add a paid speech provider based only on feature lists; test Sinhala samples first.
- Keep provider keys server-side.
- Preserve typed input and credential-free starter mode.
- Keep raw audio ephemeral unless the owner explicitly opts into local storage.
- Do not label confidence or transcript similarity as phoneme assessment.

## Success Criteria

An integration should materially improve Sinhala recognition or playback on the owner's actual devices without making local setup fragile or privacy claims misleading.
