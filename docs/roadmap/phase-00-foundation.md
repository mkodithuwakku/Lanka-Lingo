# Phase 00: Local Speaking Room

## Status

Implemented in the local MVP.

## Delivered

- Responsive Sinhala conversation interface.
- One-tap English rescue mode.
- Browser microphone recognition for `si-LK` and English.
- Sinhala playback and slow replay through Azure Speech or a genuine installed `si-LK` voice.
- Active phrase practice with Sinhala-aware transcript comparison.
- Credential-free phrase catalog and prompt loop.
- Optional structured OpenAI tutor route with safe local fallback.
- Optional server-side Azure Speech route that prevents English voices from reading Sinhala punctuation.
- No accounts, database, analytics, or application-level audio storage.
- Offline domain tests, TypeScript validation, and production build scripts.
- Documentation rewritten around personal local use.

## Exit Criteria

- Tests, TypeScript check, and production build pass.
- Core path remains usable without an API key.
- API credentials never reach client code.
- UI states the limitation of recognition-based pronunciation feedback.

## Free Practice Completion Pass

Implemented default provider opt-out, browser-local guided rounds, the 38-phrase search library, exact phrase retrieval, explicit round completion/restart/next topic, preserved English-help context, optional installed-voice playback, recognition cancellation/error recovery, and Sinhala combining-mark preservation.
