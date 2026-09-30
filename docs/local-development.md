# Local Development

## Free Practice Setup

Requirements: Node.js 23.6 or newer, npm, and Chrome for microphone recognition.

From the repository directory (the inner `Lanka-Lingo` folder):

```bash
npm install
npm run dev
```

Open http://localhost:3000. No environment file or provider account is required.

`ENABLE_PAID_SERVICES` defaults to disabled. Even if OpenAI or Azure keys exist in the shell, they do not enable provider calls unless this flag is exactly `true`. Free conversation and phrase lookup run directly in the browser. Browser speech recognition may still use the browser vendor's servers; free does not mean fully offline.

## First Practice Session

- Choose a topic and answer three saved questions by voice or text. Suggested replies can be selected, practiced, and sent.
- Open English help and search the phrase library. It includes eight essentials and thirty topic replies. Select a sentence or enter its English meaning.
- Return to Sinhala: the current question and conversation practice target are preserved.
- Complete the round, then restart or choose the next topic.
- If Listen is disabled, the browser has no Sinhala voice. Use the romanization for self-practice. No account setup is necessary to keep using the free version.
- Microphone unavailable or denied: use typed input. A recognition failure is not a pronunciation grade.

## Validation

```bash
npm test
npm run check
npm run build
```

The tests require no credentials or network. Real microphone quality and spoken Sinhala content still require owner/fluent-speaker review. See `docs/testing/README.md` for the manual checklist.

## Later: Provider Opt-In

Only when you choose to enable paid services:

```bash
cp .env.example .env.local
```

Set `ENABLE_PAID_SERVICES=true` and the provider's credentials. OpenAI needs `OPENAI_API_KEY` and optionally `OPENAI_MODEL`; Azure needs `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION`, with optional `AZURE_SPEECH_VOICE`. Restart the server. Both integrations remain independently optional. Keys are server-only and `.env.local` must not be committed.

To return to free practice, set `ENABLE_PAID_SERVICES=false`, restart, and reload the page.

## Troubleshooting

### Free practice instead of live tutor

Expected by default. Leave it this way for zero provider charges. The saved content supports the complete guided practice flow.

### An English sentence is not found

Search the phrase library for the idea and select an included sentence. Automatic lookup deliberately avoids partial keyword matching so that negations and unrelated sentences are not silently mistranslated.

### No microphone or no recognized speech

Use Chrome, check site microphone permissions and the operating system input device, or type. Stop microphone cancels an attempt; starting another topic or switching mode also cancels it.

### No Sinhala audio

Playback requires a genuine installed Sinhala browser voice in free mode. No default English voice is used. Microphone recognition does not require playback. Auto-play is initially off.

### Testing from a phone

`npm run dev -- --hostname 0.0.0.0` exposes the app on your LAN. Browser microphone APIs generally require a secure context: localhost works on the computer, but a phone's plain HTTP LAN address may not. Trusted local HTTPS or a secure tunnel is deferred.
