import assert from "node:assert/strict";
import test from "node:test";
import { initialScenarios } from "../../src/content/scenarios.ts";
import { createLearnerProfile } from "../../src/services/onboarding.ts";
import { createTutorTurn } from "../../src/services/conversationEngine.ts";
import { evaluatePronunciation } from "../../src/services/pronunciation.ts";
import { createProgressState, applyProgressEvents } from "../../src/services/progress.ts";
import { summarizeSession } from "../../src/services/sessionReview.ts";
import type { ConversationSession, ProgressEvent } from "../../src/domain/types.ts";

const profile = createLearnerProfile({
  id: "learner-conversation",
  background: "beginner",
  goals: ["family conversation"]
});

const scenario = initialScenarios[0];

test("FR-2/FR-3: tutor turn includes Sinhala audio text, English caption, and romanized suggestions", () => {
  const turn = createTutorTurn({
    profile,
    scenario,
    speech: {
      transcript: "ayubowan",
      confidence: 0.92,
      expectedPhrase: "ayubowan",
      volumeDb: -20
    }
  });

  assert.ok(turn.tutorSinhala.length > 0);
  assert.ok(turn.englishCaption.includes("Practice goal"));
  assert.ok(turn.suggestedReplies.length >= 2);
  assert.equal(turn.suggestedReplies[0].romanizedSinhala, "ayubowan");
  assert.equal(turn.suggestedReplies[0].difficulty, "current");
});

test("FR-5: likely mispronounced phrase produces a retry hint without overclaiming", () => {
  const feedback = evaluatePronunciation({
    transcript: "aboan",
    confidence: 0.41,
    expectedPhrase: "ayubowan",
    volumeDb: -18
  });

  assert.equal(feedback.status, "retry");
  assert.match(feedback.messageEnglish, /try/i);
  assert.equal(feedback.targetPhrase, "ayubowan");
});

test("FR-5: quiet audio asks for microphone repair instead of penalizing pronunciation", () => {
  const feedback = evaluatePronunciation({
    transcript: "",
    confidence: 0.1,
    expectedPhrase: "kohomada",
    volumeDb: -60
  });

  assert.equal(feedback.status, "note");
  assert.match(feedback.messageEnglish, /speak.*louder|moving closer/i);
});

test("FR-6: progress advances through practiced objectives and pronunciation signals", () => {
  const events: ProgressEvent[] = [
    { type: "objective_practiced", value: "Greet someone." },
    { type: "objective_practiced", value: "Ask how someone is." },
    { type: "objective_practiced", value: "Answer a follow-up." },
    { type: "pronunciation_signal", value: "improvement" }
  ];

  const state = applyProgressEvents(createProgressState(0), events);

  assert.equal(state.level, 1);
  assert.equal(state.objectivesPracticed.size, 3);
});

test("FR-9: session review summarizes practiced phrases and limits pronunciation notes", () => {
  const turn = createTutorTurn({
    profile,
    scenario,
    speech: {
      transcript: "aboan",
      confidence: 0.41,
      expectedPhrase: "ayubowan",
      volumeDb: -18
    }
  });

  const session: ConversationSession = {
    id: "session-1",
    learnerId: profile.id,
    scenarioId: scenario.id,
    completedObjectives: [scenario.objective],
    turns: [turn, turn, turn]
  };

  const review = summarizeSession(session);

  assert.ok(review.practicedPhrases.includes("ayubowan"));
  assert.ok(review.pronunciationNotes.length <= 2);
  assert.match(review.nextStep, /Continue|Repeat/);
});
