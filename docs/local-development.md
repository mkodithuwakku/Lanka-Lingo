# Local Development

This guide explains how to run the Lanka Lingo project locally.

## Current Project State

The project currently has two runnable layers:

- Acceptance/domain test suite: runs now with Node's built-in test runner and does not require provider credentials.
- Mobile-first Next.js/PWA shell: requires installing npm dependencies before it can run locally.

Live Azure Speech and OpenAI conversation calls are not implemented yet. Provider interfaces exist so those integrations can be added safely later without changing the learning-loop tests.

## Requirements

- Node.js `23.6.0` or newer.
- npm.
- No Azure or OpenAI credentials are required for the current test suite.

Check Node:

```bash
node --version
```

## Install Dependencies

From the project root:

```bash
npm install
```

This installs Next.js, React, TypeScript, OpenAI SDK, and Azure Speech SDK dependencies declared in `package.json`.

## Run Tests

```bash
npm test
```

Expected result:

- 15 acceptance/domain tests pass.
- No network calls are made.
- No provider credentials are required.

The tests cover onboarding, romanized Sinhala suggestions, pronunciation heuristics, progress, session review, privacy defaults, scenario content, and the multiple-Sinhala-speaker review gate.

## Run The Web/PWA Shell

After installing dependencies:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

The current UI is a mobile-first landing/conversation scaffold. It is not yet wired to live microphone recording, Azure Speech, or OpenAI tutor responses.

## Build The App

```bash
npm run build
```

If the build fails because dependencies are missing, run `npm install` first.

## Environment Variables

No environment variables are required yet.

Future provider integration will likely need server-side variables such as:

```bash
AZURE_SPEECH_KEY=
AZURE_SPEECH_REGION=
OPENAI_API_KEY=
```

Do not commit `.env` or `.env.local`; they are ignored by `.gitignore`.

## Development Workflow

1. Read `SPECIFICATION.md` for product behavior.
2. Read `docs/codex-context.md` for fast orientation.
3. Update or add acceptance tests when changing a user story.
4. Keep provider calls behind interfaces in `src/providers/`.
5. Run `npm test` before handing off changes.
6. Update `docs/roadmap/` when implementation scope changes.

## Common Issues

### `npm run dev` fails with missing Next.js

Run:

```bash
npm install
```

### Tests show an experimental TypeScript stripping warning

This is expected with Node 23's built-in TypeScript execution. The tests still pass. If this becomes noisy later, the project can switch to a dedicated TypeScript test runner.

### Microphone or AI conversation does not work

That is expected for the current foundation phase. The UI is scaffolded, while live speech and tutor provider integrations are planned for later roadmap phases.
