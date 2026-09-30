# Codex Context

## Product Direction

Lanka Lingo is a local-first personal Sinhala speaking tool, not a general course platform. The owner fully understands spoken Sinhala but sometimes cannot retrieve sentences. The app should keep prompting a realistic casual conversation, let the owner switch to English when stuck, teach one natural phrase, and confirm that Chrome recognition heard the intended Sinhala phrase.

## Fixed Decisions

- Runs locally and can be cloned from GitHub.
- No authentication, database, subscriptions, admin tools, or required hosting.
- Chrome-only prototype; do not spend effort on Safari, Firefox, or native packaging.
- Neutral everyday colloquial Sinhala is the default, with casual phrasing only.
- Topic choice supports a daily pick, presets, and arbitrary user-entered subjects.
- Live tutor turns acknowledge the learner and ask follow-ups. Free mode uses three-question scripted rounds, then completion/restart/next-topic controls.
- Suggested replies are retrieval scaffolds, not beginner comprehension aids.
- Sinhala conversation and English rescue are equal first-class modes.
- Sinhala script, romanization, and English meaning appear together.
- Raw audio and conversation history are not stored by the app.
- The pronunciation result is transcript similarity, never phoneme-level grading.
- The optional AI key remains server-side. Paid services require `ENABLE_PAID_SERVICES=true` plus credentials; free practice is the default.
- Free conversation and phrase lookup run in the browser without provider requests.
- English help uses a searchable 38-phrase library and exact known aliases, not substring translation.
- Explicit conversation steps and saved targets keep English help from disrupting a round.
- Free playback uses only an installed Sinhala voice; otherwise disable audio and explain self-practice. Azure is available only after explicit opt-in. Never use a default English voice. Auto-play starts off.

## Code Map

- `SPECIFICATION.md`: product contract and acceptance cases.
- `app/tutor-app.tsx`: complete interactive client.
- `app/api/tutor/route.ts`: bounded server API and provider fallback.
- `app/api/speech/route.ts`: bounded Sinhala MP3 route and safe configuration errors.
- `src/providers/openaiTutor.ts`: optional structured OpenAI tutor.
- `src/providers/azureSpeech.ts`: Azure Sri Lankan Sinhala synthesis adapter.
- `src/services/localTutor.ts`: credential-free starter tutor.
- `src/services/pronunciation.ts`: Sinhala-aware transcript comparison.
- `src/content/phrases.ts`: starter English-rescue phrase catalog.
- `src/content/topics.ts`: topic tracks and conversation prompts.
- `tests/acceptance/`: offline product-behavior tests.

## Working Rules

1. Preserve useful operation without credentials.
2. Do not add persistence or accounts unless the owner changes the product goal.
3. Keep provider credentials out of client components and Git.
4. Keep Sinhala claims humble and request fluent-speaker review for content changes.
5. Run `npm test`, `npm run check`, and `npm run build` before handoff.
6. Update the specification, architecture, local-development guide, roadmap, and tests when behavior changes.

## Highest-Value Next Work

1. Owner checks real Sinhala recognition and microphone permissions in Chrome, using free practice.
2. Fluent speaker reviews existing Sinhala, romanization, and casual tone; automated tests do not establish language quality.
3. Collect specific missing phrases or rough interactions from actual sessions before expanding the catalog.
4. Defer OpenAI, Azure, dedicated speech recognition, and cloud deployment until the owner requests them. No paid account setup is needed for this phase.
