# Lanka Lingo Product Specification

Version: 1.1

Date: 2026-09-12

Status: Free guided practice implemented; device/content validation pending

## Product Goal

Lanka Lingo is a private speaking companion that helps its owner turn full Sinhala comprehension into confident speech. The owner is a heritage learner who understands spoken Sinhala but sometimes cannot retrieve a sentence quickly. The primary loop is not lessons, levels, flashcards, or reading practice. It is:

1. Listen to a short Sinhala tutor turn.
2. Reply naturally in Sinhala.
3. Receive a short contextual Sinhala response.
4. Switch to English immediately when a sentence is missing.
5. Ask “How do I say…” and receive Sinhala script, romanization, meaning, and spoken playback.
6. Repeat the new phrase and receive a humble recognition-based check.
7. Return to the Sinhala conversation.

## Intended User And Distribution

- Primary user: the repository owner, practicing locally in Chrome.
- Learner profile: full spoken comprehension with sentence-retrieval and speaking-confidence gaps.
- Secondary users: people who clone the public GitHub repository and supply their own optional API key.
- There is no planned hosted service, shared user database, billing system, or account management for the MVP.
- Chrome is the only supported browser for the prototype. Native application packaging is deferred because it adds complexity without improving the initial learning loop.
- The tutor uses neutral everyday colloquial Sinhala and teaches one casual recommended phrase rather than multiple registers.

## Functional Requirements

### FR-1: Sinhala Conversation

- The learner can speak or type a Sinhala turn.
- The tutor returns short colloquial Sinhala, romanization, and English meaning.
- The live tutor acknowledges the learner’s meaning and asks a follow-up. The free tutor uses scripted prompts and explicitly does not interpret the answer.
- A free topic has three questions and a clear completion state, with restart and next-topic controls. English help never advances its step.
- The learner can use a deterministic topic of the day, choose a preset, or type a custom topic.
- The tutor provides two optional short Sinhala replies to reduce sentence-retrieval freezes without testing comprehension.
- Free practice is the default. Five guided topics and 38 existing phrases require no provider account or environment file. Custom topics disclose that their prompts are generic.

### FR-2: English Rescue Mode

- The learner can switch between Sinhala and English input with one action.
- English mode accepts natural framing such as “How do I say can you speak slowly again?”
- A searchable phrase library exposes all 38 included sentences, with topic filters and an actionable empty state.
- Free lookup accepts complete known sentences and aliases; it must not treat a keyword inside an unrelated or negated sentence as a translation. Unknown requests label any repair phrase as an alternative, not a translation.
- The response teaches one included Sinhala sentence with script, romanization, meaning, and a brief usage note.
- The newly taught sentence becomes the active pronunciation target. Returning to Sinhala restores the conversation target and question. Selecting either suggested reply updates the practice target.

### FR-3: Listening And Playback

- Tutor Sinhala can be played automatically or on demand when a voice is available. Auto-play starts off.
- Free mode checks for an installed Sinhala voice. If unavailable, disable playback with an explanation and preserve text/microphone practice; do not prompt for paid setup.
- The active phrase can be replayed at a slower rate.
- Playback uses the server-side Azure Speech integration only when explicitly enabled and configured and requests a Sri Lankan Sinhala neural voice.
- When Azure Speech is unavailable, playback may use Chrome only if the browser exposes a genuine `si-LK` system voice.
- The app must never send Sinhala to an English/default system voice; if no Sinhala voice is available, it explains that playback is unavailable and self-practice remains available.

### FR-4: Pronunciation Practice

- The learner can record a focused attempt of the active Sinhala phrase.
- The app compares the recognized Sinhala transcript to the target and returns a match score, what was heard, and a retry/close/clear state.
- Feedback must always disclose that this is transcript similarity, not phoneme-level assessment.
- Microphone or recognizer uncertainty must not be presented as proof of bad pronunciation. Sinhala vowel marks must affect comparison.
- Stop microphone cancels without sending a result. Mode/topic changes cancel recognition; starting recognition stops playback. Start errors and empty results offer a typed fallback.

### FR-5: Local-First Operation

- The app runs with `npm run dev` and requires no account or database.
- The default test suite makes no network calls and requires no provider credentials.
- Without live capability, guided replies and phrase lookup execute in the browser without provider-route requests.
- Both provider routes require `ENABLE_PAID_SERVICES=true` and credentials. Keys alone cannot enable billed calls.
- Typed input remains available if Chrome recognition fails or microphone permission is denied.

### FR-6: Privacy

- Lanka Lingo itself does not persist raw audio, transcripts, or conversation history.
- Conversation state exists only in the current browser page and resets on refresh.
- The UI must warn that browser speech recognition may send audio to the browser vendor even though the app is served locally.
- OpenAI and Azure Speech keys stay server-side. OpenAI tutor requests set `store: false`.
- Azure receives phrase text only when Sinhala audio is requested; generated audio is cached only in page memory for the current session.

## Explicit Non-Goals

- Accounts, authentication, cloud persistence, social features, leaderboards, or subscriptions.
- A broad curriculum, placement test, progress levels, content-management system, or teacher dashboard.
- Sinhala reading/writing instruction or handwriting assessment.
- Guaranteed offline operation. The app runs locally, but speech recognition and the optional AI tutor can use external services.
- Medical, accessibility, or certified language assessment.
- Claims of native-speaker or phoneme-level pronunciation grading.

## Quality Bar

- The UI must work with voice and typed fallbacks on narrow mobile screens and desktop.
- Every model-generated Sinhala phrase must include romanization and English meaning.
- Provider failures must fall back gracefully without exposing secret values or stack traces.
- Sinhala content intended as authoritative should be reviewed by a fluent colloquial Sinhala speaker before relying on it for long-term study.

## MVP Acceptance Cases

- Given default configuration, each preset advances through three questions, completes, and can restart or move to the next topic. History truncation and English help do not change the question index.
- Given a chosen preset or custom topic, the new session resets ephemeral conversation history and begins with a question.
- Given no API key, asking how to say “Can you speak slowly?” returns a built-in casual Sinhala phrase.
- Given an unknown English sentence, the app clearly labels its repair phrase as an alternative and directs the learner to the free library.
- Given an English request with “How do I say… again?”, the filler words are removed before tutor processing.
- Given an exact Sinhala transcript, phrase comparison preserves Sinhala Unicode and returns a clear match.
- Given unavailable microphone recognition, the learner can continue by typing.
- Given free mode and no installed Sinhala voice, Listen is disabled with a text-practice explanation; no speech API request occurs.
- Given explicit paid-service opt-in and valid Azure Speech settings, normal and slow playback return Sri Lankan Sinhala audio without exposing the key to the browser.
- Given explicit paid-service opt-in and a configured API key, the server returns a structured tutor reply and keeps the key out of the browser.
