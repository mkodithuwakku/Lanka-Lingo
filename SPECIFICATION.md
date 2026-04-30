# Lanka Lingo Application Specification

Version: 0.1  
Date: 2026-04-30  
Status: Draft for product and technical alignment

## 1. Product Summary

Lanka Lingo is a conversation-first Sinhala learning application. Instead of progressing mainly through memorized vocabulary lists, grammar drills, or exam-style checkpoints, learners progress by having guided spoken Sinhala conversations with an AI tutor. The app listens to the learner, responds in Sinhala, gives live English support when needed, detects likely pronunciation issues, and suggests what the learner can say next without taking away the feeling of real conversation.

The core product promise is: "Learn Sinhala by speaking Sinhala, with just enough English support to keep going."

## 2. Goals

- Enable beginners and intermediate learners to practice spoken Sinhala in realistic, low-pressure conversations.
- Provide real-time Sinhala conversation with optional English hints, small English captions, and suggested replies.
- Detect poorly pronounced Sinhala well enough to give helpful corrective feedback, even if full Sinhala phoneme-level scoring is limited by current provider support.
- Progress learners through levels based on conversational ability, comprehension, pronunciation confidence, vocabulary coverage, and repair strategies.
- Make learning feel like preparing for real life: greeting family, ordering food, visiting Sri Lanka, asking for directions, talking with relatives, and handling cultural context.

## 3. Non-Goals For MVP

- The MVP will not attempt to replace a human Sinhala teacher.
- The MVP will not guarantee perfect pronunciation scoring at phoneme level because Sinhala is not broadly supported by commercial pronunciation-assessment APIs.
- The MVP will not focus on exam preparation, flashcard-only learning, or grammar worksheets as the primary learning loop.
- The MVP will not initially support Tamil, Pali, Sanskrit, or other Sri Lankan languages unless explicitly added later.
- The MVP will not initially support offline real-time conversation.
- The MVP will not teach Sinhala reading, writing, alphabet memorization, or handwriting; it is a pure spoken-conversation product.

## 4. Target Users

- Heritage learners who heard Sinhala at home but need confidence speaking.
- Beginners learning Sinhala for family, travel, culture, or relationships.
- Intermediate learners who can recognize some phrases but freeze during conversation.
- Diaspora learners who need English scaffolding while building Sinhala fluency.
- Adults are the primary audience. Older children may be able to use the app, but young children are not a target audience for the initial product because the conversation flow, privacy model, and learning style are designed for adult learners.

## 5. Key Assumptions

- The first release shall be a mobile-first responsive web/PWA experience. Native iOS and Android apps are intentionally deferred until the spoken conversation loop is validated.
- Sinhala speech recognition and text-to-speech quality are more important than using a single all-in-one AI vendor.
- English is the learner's support language for hints, captions, onboarding, and feedback.
- Initial Sinhala focus is colloquial spoken Sinhala, not formal literary Sinhala.
- The initial dialect target is standard Sri Lankan Sinhala, with future support for regional variation and family-specific phrasing.
- Reading and writing are intentionally out of scope; the learning model is listening, speaking, repairing, and continuing conversation.

### 5.1 Mobile-First Web/PWA First Release Rationale

The committed first release path is to validate the experience as a mobile-first responsive web app or PWA, then consider native iOS and Android once the conversation loop has proven itself. This does not mean the product should feel like a desktop website. It should still be designed around phone use, microphone access, thumb-friendly controls, short sessions, and app-like installation.

Reasons to start web/PWA first:

- Speech-provider risk is the biggest early unknown. Sinhala speech recognition, Sinhala TTS naturalness, latency, and pronunciation heuristics should be tested with real users before committing to separate native app codebases.
- Iteration speed matters. Conversation design, hint wording, pronunciation feedback, and Sinhala style will need frequent changes; web deployment lets the team ship improvements without app-store review delays.
- The backend and AI architecture are the product's hardest parts. A web MVP lets the team focus on tutor quality, provider orchestration, privacy, progress tracking, and content design before duplicating interface work across platforms.
- User testing is easier. A browser link is easier to share with heritage learners, family testers, language teachers, and early Sri Lankan community reviewers than a TestFlight or Play Store beta.
- Cost and scope stay controlled. Native mobile adds push notification, store compliance, device-specific audio behavior, release management, and platform QA overhead before the team knows which learning loop works best.
- PWA can still support the intended MVP. Modern browsers can handle microphone permission, audio recording, streaming, captions, account flows, and app-like mobile layouts well enough for product validation.

Product timeline:

1. Prototype: Web proof of concept for Sinhala STT, Sinhala TTS, tutor response structure, and live captions.
2. MVP: Mobile-first PWA with onboarding, guided conversations, suggested replies, opt-in audio storage, progress tracking, and review.
3. Beta: Improve latency, content quality, privacy controls, pronunciation repair, and analytics with real adult learners.
4. Native apps: Build iOS and Android once retention, speech quality, and the core conversation loop are validated.

Native apps should move earlier only if browser audio limitations prevent reliable real-time conversation, if offline support becomes required, or if app-store distribution is essential for the first user group.

### 5.2 Romanization Definition

Romanization means writing Sinhala sounds using English/Latin letters. For example, a Sinhala phrase could be shown in Sinhala script, with a romanized pronunciation guide beside it so learners can speak before they can read Sinhala script.

For this product, romanization is included as a first-class support format, not merely an optional edge feature. Many Sinhala speakers commonly write Sinhala using Latin letters in everyday messages because Sinhala keyboards are not always used, especially among older users. Lanka Lingo should therefore support romanized Sinhala in suggested replies, phrase review, and content authoring.

Romanization is still not a reading/writing curriculum. The product remains pure conversation, with romanized text serving as a practical bridge between English hints, Sinhala audio, and spoken Sinhala. Sinhala script may be available where useful, but learners should not need to read or type Sinhala script to use the MVP.

## 6. Recommended Technical Stack

### 6.1 Stack Decision

Use a hybrid speech and LLM architecture:

- Frontend: Next.js, React, TypeScript, PWA, Web Audio APIs.
- Backend: Node.js with NestJS or Fastify, TypeScript, PostgreSQL, Redis, object storage only for explicitly opted-in audio samples.
- Speech recognition: Azure AI Speech real-time speech-to-text with `si-LK`.
- Text-to-speech: Azure AI Speech Sinhala neural voices `si-LK-ThiliniNeural` and `si-LK-SameeraNeural`.
- Conversation intelligence: OpenAI text/reasoning model for tutor dialogue, lesson state, hint generation, correction framing, and safety guardrails.
- Optional realtime layer: OpenAI Realtime API for low-latency multimodal experiments where Sinhala quality is acceptable, but not as the primary Sinhala STT dependency for MVP.
- Translation and caption support: LLM-generated English captions checked against conversation state; optionally Azure Translator or Google Cloud Translation as a secondary validation layer.
- Pronunciation feedback: Custom pronunciation heuristic using ASR confidence, expected-phrase similarity, repeated recognition failures, audio features, and a Sinhala-specific phrase bank rather than relying solely on unsupported phoneme-level pronunciation assessment.

### 6.2 Rationale

Azure AI Speech currently lists Sinhala (`si-LK`) for speech-to-text and Sinhala neural voices for text-to-speech. Azure pronunciation assessment does not list Sinhala among its supported pronunciation-assessment locales, so MVP pronunciation feedback should be framed as "likely pronunciation issue" rather than definitive phoneme scoring. OpenAI speech-to-text currently lists many supported languages but does not list Sinhala in the supported language list, while OpenAI Realtime is still valuable for low-latency speech-to-speech architecture and conversational AI patterns.

### 6.3 References Used For Stack Selection

- Azure AI Speech language and voice support: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support
- OpenAI Realtime conversations: https://developers.openai.com/api/docs/guides/realtime-conversations
- OpenAI speech-to-text supported languages: https://developers.openai.com/api/docs/guides/speech-to-text
- Google Cloud Speech-to-Text V2 Sinhala support reference: https://docs.cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages

## 7. Product Experience

### 7.1 Core Learning Loop

1. The learner chooses a scenario, goal, or current level.
2. The AI tutor introduces a short conversation context in English and Sinhala.
3. The learner speaks Sinhala.
4. The app transcribes the learner's Sinhala, shows small English live captions, and identifies confidence/clarity issues.
5. The AI tutor responds in natural Sinhala at the learner's level.
6. The app suggests two or three possible things to say next in English, with expandable Sinhala versions.
7. The learner continues the conversation.
8. At natural stopping points, the app summarizes what the learner practiced and recommends the next conversation.

### 7.2 Conversation Modes

- Guided Conversation: The app suggests likely replies and gently nudges the learner.
- Free Talk: The learner speaks more freely and receives lighter scaffolding.
- Repeat and Repair: The learner retries mispronounced or misunderstood phrases.
- Roleplay: The learner practices practical situations such as market, airport, family dinner, tuk-tuk ride, or temple visit.
- Listening First: The learner hears Sinhala and responds with short spoken answers.
- Review Conversation: The learner revisits phrases from prior sessions in a new context.

### 7.3 Learner Progression

Progress is based on conversational competence, not exam scores. The system tracks:

- Can the learner respond without waiting for a full suggested phrase?
- Can the learner repair a misunderstanding?
- Can the learner pronounce target phrases clearly enough for recognition?
- Can the learner understand common Sinhala responses with partial English support?
- Can the learner reuse vocabulary across different scenarios?
- Can the learner sustain longer turns over time?

Suggested levels:

- Level 0: Survival sounds and greetings.
- Level 1: Simple replies and introductions.
- Level 2: Everyday needs and family conversation.
- Level 3: Short independent conversations.
- Level 4: Storytelling, opinions, and cultural nuance.
- Level 5: Flexible conversation with minimal English support.

## 8. Functional Requirements

### FR-1: Onboarding And Placement

The app shall onboard a learner with language background, goals, preferred support level, and a short spoken placement check.

User Story: As a new learner, I want the app to understand my Sinhala background so that conversations start at the right difficulty.

Acceptance Cases:

```gherkin
Scenario: New beginner completes onboarding
  Given I open the app for the first time
  When I select "I am a beginner" and choose "family conversation" as my goal
  Then the app creates a learner profile
  And assigns me to Level 0 or Level 1
  And recommends a first guided conversation
```

```gherkin
Scenario: Heritage learner completes onboarding
  Given I say I heard Sinhala at home but rarely speak it
  When I complete the placement prompt
  Then the app stores my background as heritage learner
  And starts with listening-supported conversation rather than alphabet-only lessons
```

```gherkin
Scenario: Learner skips placement
  Given I am on the placement step
  When I choose to skip
  Then the app starts me at the safest beginner level
  And allows level adjustment after the first conversation
```

### FR-2: Real-Time Sinhala Conversation

The app shall support real-time spoken conversation where the learner speaks Sinhala and receives AI Sinhala audio responses.

User Story: As a learner, I want to speak to the app in Sinhala and hear Sinhala back so that practice feels like a real conversation.

Acceptance Cases:

```gherkin
Scenario: Learner has a guided spoken turn
  Given I am in a guided conversation
  When I press the microphone and say a Sinhala phrase
  Then the app transcribes my speech
  And the AI tutor responds with Sinhala audio
  And the next learner prompt appears without requiring a page reload
```

```gherkin
Scenario: Speech is too quiet
  Given I am speaking in conversation mode
  When my audio volume is below the usable threshold
  Then the app asks me to speak louder or move closer
  And does not penalize my progress for that turn
```

```gherkin
Scenario: Recognition fails
  Given I speak a phrase that cannot be recognized confidently
  When the speech confidence is below the configured threshold
  Then the app asks me to try again
  And shows one English hint plus an optional Sinhala phrase
```

### FR-3: Suggested Things To Say

The app shall provide suggested replies in English and romanized Sinhala, with optional Sinhala script reveal where available, based on the current conversation context.

User Story: As a learner, I want suggestions for what to say next so that I do not freeze during conversation.

Acceptance Cases:

```gherkin
Scenario: Suggestions appear during conversation
  Given the AI tutor asks me a question in Sinhala
  When it is my turn to respond
  Then I see two or three short English suggestions
  And each suggestion includes or can reveal romanized Sinhala
  And each suggestion can reveal the Sinhala script where available
```

```gherkin
Scenario: Suggestions match learner level
  Given I am a Level 1 learner
  When suggestions are generated
  Then each suggested reply uses short phrases
  And avoids grammar that is outside my current learning profile unless marked as a stretch option
```

```gherkin
Scenario: Learner ignores suggestions
  Given suggestions are visible
  When I say my own Sinhala response
  Then the app accepts my response
  And continues the conversation without forcing a suggested answer
```

```gherkin
Scenario: Learner uses romanized Sinhala support
  Given I am viewing suggested replies
  When I choose a suggested reply
  Then I can see the English meaning
  And I can see the romanized Sinhala phrase
  And I can hear the Sinhala audio pronunciation
```

### FR-4: English Live Captions

The app shall show small English live captions or summaries that help comprehension without dominating the Sinhala conversation.

User Story: As a learner, I want small English captions so that I can follow the conversation while still focusing on Sinhala.

Acceptance Cases:

```gherkin
Scenario: English caption appears for tutor speech
  Given the AI tutor says a Sinhala sentence
  When the sentence is spoken
  Then a concise English caption appears near the bottom of the conversation
  And the Sinhala transcript remains available separately
```

```gherkin
Scenario: Learner disables captions
  Given captions are enabled
  When I switch captions off
  Then future tutor turns do not show English captions by default
  And I can tap to reveal an English meaning when needed
```

```gherkin
Scenario: Caption avoids word-for-word overload
  Given the tutor says a long Sinhala response
  When the English caption is shown
  Then the caption summarizes the meaning in beginner-friendly English
  And does not cover the primary speaking controls
```

### FR-5: Pronunciation Feedback

The app shall identify likely poorly pronounced Sinhala and provide supportive, actionable hints.

User Story: As a learner, I want the app to notice when my Sinhala pronunciation is unclear so that I can improve without feeling judged.

Acceptance Cases:

```gherkin
Scenario: Phrase is likely mispronounced
  Given I attempt a target Sinhala phrase
  When speech recognition confidence is low
  And the recognized text differs significantly from the expected phrase
  Then the app marks the phrase as "try again"
  And gives a short hint such as "slow down the middle sound"
  And allows me to hear the phrase again
```

```gherkin
Scenario: Learner improves after retry
  Given I previously received a pronunciation hint
  When I retry and recognition confidence improves
  Then the app acknowledges the improvement
  And continues the conversation
```

```gherkin
Scenario: App cannot confidently diagnose pronunciation
  Given my speech is unclear
  When the system cannot distinguish pronunciation from microphone or background noise issues
  Then the app avoids claiming a specific pronunciation error
  And suggests a neutral retry such as "Let's try that one more time, a little slower"
```

```gherkin
Scenario: Learner requests detailed feedback
  Given a pronunciation issue is detected
  When I tap "Why?"
  Then the app shows the expected phrase
  And the recognized phrase if available
  And one plain-English practice tip
```

### FR-6: Conversation-Based Progression

The app shall unlock new learning content based on demonstrated conversational ability rather than only quizzes.

User Story: As a learner, I want to progress by actually speaking Sinhala so that levels reflect real ability.

Acceptance Cases:

```gherkin
Scenario: Learner completes a conversation objective
  Given I am practicing "introducing myself"
  When I successfully greet, say my name, and answer one follow-up question
  Then the objective is marked practiced
  And my learner profile updates with the phrases used
```

```gherkin
Scenario: Learner unlocks next conversation
  Given I have completed enough Level 1 conversation objectives
  When my comprehension and speaking confidence meet the threshold
  Then the app recommends a Level 2 conversation
  And explains what new skill is being introduced
```

```gherkin
Scenario: Learner needs more practice
  Given I struggle with the same objective across multiple sessions
  When confidence remains below the threshold
  Then the app recommends a repair or review conversation
  And does not frame the result as failure
```

### FR-7: Adaptive Tutor Persona

The app shall adapt tutor speaking speed, vocabulary, English support, and correction strictness.

User Story: As a learner, I want the AI tutor to match my level so that conversation is challenging but not overwhelming.

Acceptance Cases:

```gherkin
Scenario: Tutor slows down for beginner
  Given I am at Level 0
  When the tutor speaks Sinhala
  Then responses are short
  And audio speed is beginner-friendly
  And English support is available by default
```

```gherkin
Scenario: Tutor reduces English over time
  Given I repeatedly understand a phrase category
  When future conversations use that category
  Then the app reduces automatic English captions
  And keeps tap-to-reveal help available
```

```gherkin
Scenario: Learner asks for more help
  Given I am in a conversation
  When I say or tap "help"
  Then the tutor provides an English hint
  And gives a simple Sinhala phrase I can try
```

### FR-8: Scenario Library

The app shall provide scenario-based lessons and conversations.

User Story: As a learner, I want scenarios that match real life so that my practice feels useful.

Acceptance Cases:

```gherkin
Scenario: Learner selects a scenario
  Given I am on the practice screen
  When I choose "At a family dinner"
  Then the app starts a conversation with relevant vocabulary
  And sets a clear speaking objective
```

```gherkin
Scenario: Scenario includes cultural notes
  Given a phrase has cultural nuance
  When the phrase appears in conversation
  Then the app can show a short optional note
  And the note does not interrupt the spoken flow
```

```gherkin
Scenario: Scenario difficulty is locked
  Given I choose an advanced scenario
  When my current level is too low
  Then the app offers a simpler version
  And lets me preview the advanced scenario as a stretch exercise
```

### FR-9: Conversation Review

The app shall summarize each completed conversation with practiced phrases, pronunciation notes, comprehension highlights, and next steps.

User Story: As a learner, I want a useful review after speaking so that I know what improved and what to practice next.

Acceptance Cases:

```gherkin
Scenario: Session review is generated
  Given I finish a conversation
  When the review screen opens
  Then I see the main phrases I practiced
  And one or two pronunciation notes
  And a recommended next conversation
```

```gherkin
Scenario: Learner replays tutor phrase
  Given a phrase appears in review
  When I tap the audio button
  Then the app plays the Sinhala phrase
  And shows its English meaning
```

```gherkin
Scenario: Review protects learner confidence
  Given I had multiple recognition issues
  When the review is generated
  Then the app prioritizes the highest-value correction
  And avoids showing an overwhelming list of mistakes
```

### FR-10: Vocabulary And Phrase Memory

The app shall maintain a learner-specific memory of phrases encountered, attempted, understood, and reused.

User Story: As a learner, I want the app to remember what I have practiced so that future conversations build on it.

Acceptance Cases:

```gherkin
Scenario: Phrase is added to learner memory
  Given I use a new phrase in conversation
  When the phrase is recognized or selected
  Then the app stores it in my phrase history
  And marks the context where it appeared
```

```gherkin
Scenario: Phrase resurfaces later
  Given I practiced a phrase two sessions ago
  When I start a related scenario
  Then the app can reuse the phrase naturally
  And tracks whether I remember it without prompting
```

```gherkin
Scenario: Learner views phrase bank
  Given I open my phrase bank
  When phrases are displayed
  Then I can see romanized Sinhala, English meaning, audio playback, and practice status
  And I can reveal Sinhala script where available
```

### FR-11: Safety, Privacy, And Consent

The app shall be explicit about microphone use, audio storage, AI processing, and learner data controls.

User Story: As a learner, I want control over my voice data so that I can practice safely.

Acceptance Cases:

```gherkin
Scenario: Microphone permission requested
  Given I start my first spoken conversation
  When the app needs microphone access
  Then it explains why access is needed
  And requests permission through the browser or device prompt
```

```gherkin
Scenario: Learner opts out of audio storage
  Given I am in privacy settings
  When I leave audio retention disabled
  Then future raw audio is not stored after processing
  And the app still stores non-audio learning progress if permitted
```

```gherkin
Scenario: Learner explicitly opts into audio storage
  Given audio retention is disabled by default
  When I enable audio retention after reading the explanation
  Then the app stores future raw audio only for the stated purposes
  And shows how to turn audio retention off again
```

```gherkin
Scenario: Learner deletes account data
  Given I request account deletion
  When deletion is confirmed
  Then learner profile, stored audio, transcripts, and progress records are queued for deletion
  And the app confirms deletion status
```

### FR-12: Admin Content Management

The app shall allow authorized content editors to create scenarios, target phrases, hints, cultural notes, and level mappings.

User Story: As a content editor, I want to manage Sinhala learning content so that the AI tutor teaches consistent and culturally appropriate material.

Acceptance Cases:

```gherkin
Scenario: Editor creates scenario
  Given I am an authorized editor
  When I create a new scenario with target phrases and level
  Then the scenario is saved as draft
  And is not visible to learners until published
```

```gherkin
Scenario: Editor adds target phrase
  Given I am editing a scenario
  When I add a Sinhala phrase, English meaning, romanization, and audio reference
  Then the app validates required fields
  And stores the phrase for tutor use
```

```gherkin
Scenario: Editor publishes romanized Sinhala
  Given I am editing a phrase
  When I enter the romanized Sinhala form used by native speakers in everyday messaging
  Then the app stores it as the learner-facing text support
  And keeps Sinhala script as a separate optional field
```

```gherkin
Scenario: Published content is versioned
  Given a scenario is already published
  When I edit its target phrases
  Then the app creates a new content version
  And preserves learner history against the prior version
```

```gherkin
Scenario: Colloquial phrasing is reviewed before release
  Given a scenario is ready for public release
  When the content is submitted for review
  Then multiple Sinhala speakers must review the colloquial phrasing
  And the scenario cannot be marked release-ready until review approval is recorded
```

## 9. AI Tutor Requirements

### 9.1 Tutor Behavior

The AI tutor shall:

- Keep Sinhala conversation central.
- Use English only as scaffold, not as the default teaching medium during active conversation.
- Avoid overcorrecting every mistake.
- Prefer one high-value correction per turn.
- Encourage retries without shame.
- Avoid claiming cultural or linguistic certainty when uncertain.
- Prefer spoken Sinhala suitable for everyday conversation.
- Track the learner's current objective and gently steer back if needed.

### 9.2 Tutor Response Contract

For each learner turn, the backend should request structured tutor output:

```json
{
  "tutor_sinhala": "string",
  "english_caption": "string",
  "suggested_replies": [
    {
      "english": "string",
      "sinhala": "string",
      "romanization": "string",
      "difficulty": "current | stretch"
    }
  ],
  "pronunciation_feedback": {
    "status": "none | retry | improvement | note",
    "message_english": "string",
    "target_phrase": "string"
  },
  "progress_events": [
    {
      "type": "objective_practiced | phrase_reused | comprehension_signal | pronunciation_signal",
      "value": "string"
    }
  ]
}
```

## 10. Pronunciation System Design

### 10.1 MVP Approach

Because Sinhala is not currently listed in Azure's pronunciation-assessment locales, the MVP should implement pronunciation feedback using multiple signals:

- Speech recognition confidence from Sinhala STT.
- Similarity between recognized Sinhala text and expected target phrase.
- Whether the learner was attempting a known phrase or speaking freely.
- Repeated failures on the same phrase.
- Timing and fluency proxies such as long pauses or clipped utterances.
- Noise and volume diagnostics to avoid blaming pronunciation for audio quality.
- Optional human-reviewed phrase bank with common learner mistakes.

### 10.2 Feedback Principles

- Say "I may have heard..." rather than "You pronounced this wrong" when confidence is low.
- Give one actionable hint at a time.
- Let learners replay a native or high-quality TTS version.
- Track improvement, not only errors.
- Prefer repair inside conversation instead of sending learners to a separate drill unless repeated failure occurs.

## 11. Data Model

Core entities:

- User: identity, preferences, privacy settings.
- LearnerProfile: level, goals, support language, caption preference, correction preference.
- ConversationSession: scenario, transcript, tutor turns, learner turns, timestamps, completion state.
- SpeechTurn: audio metadata, transcript, confidence, recognized language, pronunciation signals.
- Scenario: title, level, objective, setting, target phrases, cultural notes.
- Phrase: romanized Sinhala, English meaning, optional Sinhala script, audio voice, tags, difficulty.
- ProgressEvent: objective practiced, phrase learned, phrase reused, pronunciation issue, comprehension signal.
- ReviewSummary: session highlights, practice recommendations, phrase list.
- ContentVersion: scenario and phrase version metadata.

## 12. Non-Functional Requirements

- Latency: First tutor audio response should begin within 2.5 seconds for normal network conditions in MVP; target below 1.5 seconds after optimization.
- Availability: MVP target 99.5% monthly availability excluding third-party speech/LLM provider outages.
- Privacy: Raw audio storage must be off by default and opt-in only; transcript storage must be configurable and clearly disclosed.
- Accessibility: Captions, keyboard navigation, reduced motion, clear contrast, and screen reader labels are required.
- Mobile usability: Primary conversation controls must be reachable one-handed on a phone.
- Observability: Log provider latency, STT confidence, TTS latency, LLM latency, errors, and conversation completion rates without leaking sensitive content into logs.
- Cost control: Apply per-session token/audio budgets, response length limits, caching for repeated phrase audio, and provider fallback policies.
- Security: Encrypt data in transit and at rest; keep provider API keys server-side; apply rate limits and abuse detection.

## 13. MVP Scope

MVP must include:

- Account creation or anonymous trial mode.
- Mobile-first responsive web/PWA delivery.
- Onboarding and beginner placement.
- Guided spoken Sinhala conversations.
- Azure Sinhala STT and TTS integration.
- English live captions.
- Suggested replies with romanized Sinhala support.
- Basic pronunciation retry hints.
- Conversation review.
- Learner progress tracking.
- Privacy-first consent controls with raw audio retention disabled by default.
- At least 10 beginner scenarios.
- Admin-managed phrase/scenario content via seed files or a simple internal editor.

MVP may defer:

- Native iOS and Android apps.
- Offline mode.
- Full phoneme-level pronunciation scoring.
- Teacher dashboards.
- Community features.
- Payment/subscription.
- Sinhala handwriting or alphabet-specific curriculum.
- Reading and writing modules of any kind.

## 14. Initial Scenario Set

- Greeting someone respectfully.
- Introducing yourself.
- Asking how someone is.
- Talking with an auntie or uncle at a family gathering.
- Ordering tea or food.
- Asking for directions.
- Buying something at a shop.
- Saying what you like or dislike.
- Talking about where you live.
- Explaining that you are learning Sinhala.

## 15. Analytics And Success Metrics

Product metrics:

- Conversation completion rate.
- Average spoken turns per session.
- Percentage of learner turns spoken rather than selected from suggestions.
- Week 1 and Week 4 retention.
- Caption dependency trend over time.
- Phrase reuse rate across scenarios.
- Retry-to-success rate for pronunciation hints.

Quality metrics:

- STT confidence distribution for learner levels.
- Tutor response latency.
- TTS playback failure rate.
- Learner thumbs-up/down on tutor feedback.
- Human review score for sample conversation appropriateness.

## 16. Risks And Mitigations

- Risk: Sinhala STT accuracy varies by accent, microphone, and background noise.
  Mitigation: Use confidence-aware feedback, noise checks, retry flows, and collect opt-in evaluation data.

- Risk: Pronunciation feedback may be inaccurate without Sinhala phoneme-level assessment.
  Mitigation: Present feedback as likely issue, use phrase-level repair, and add human-reviewed common-mistake data.

- Risk: AI tutor may produce overly formal or unnatural Sinhala.
  Mitigation: Use curated phrase banks, spoken-Sinhala style instructions, content validation, and reviewer workflows.

- Risk: Colloquial phrasing may vary between speakers, families, and regions.
  Mitigation: Require multiple Sinhala speaker reviews before public release and record reviewer approval against each released content version.

- Risk: Latency may make conversation feel unnatural.
  Mitigation: Stream STT/TTS where possible, cache frequent TTS phrases, keep tutor turns short, and measure provider latency separately.

- Risk: Learners may over-rely on English suggestions.
  Mitigation: Fade suggestions over time and reward unprompted spoken attempts.

- Risk: Provider support changes.
  Mitigation: Abstract speech and LLM providers behind service interfaces and maintain provider evaluation tests.

## 17. Clarified Product Decisions

- The first release will be a mobile-first responsive web/PWA, not native iOS or Android.
- Romanized Sinhala will be included because many Sinhala speakers commonly type Sinhala with Latin letters, especially when Sinhala keyboards are not used.
- The app will prioritize colloquial spoken Sinhala rather than formal literary Sinhala.
- The app is primarily for adults; older children may use it, but young children are not the initial target audience.
- Raw learner audio storage will be disabled by default and opt-in only.
- The app will focus on pure conversation, not reading or writing.
- Multiple Sinhala speakers will review colloquial phrasing before public release.

## 18. Definition Of Done For MVP

- A new learner can complete onboarding and start a guided Sinhala conversation.
- The MVP runs as a mobile-first responsive web/PWA experience.
- The learner can speak Sinhala and receive Sinhala audio responses.
- English captions and romanized Sinhala suggested replies work during the conversation.
- The app can detect low-confidence or likely mispronounced target phrases and prompt a retry.
- The session review summarizes practiced phrases and next steps.
- Progress data influences the next recommended scenario.
- Privacy settings allow control over microphone, transcript, and audio retention.
- The system has automated tests for user story acceptance cases and provider fallback behavior.
