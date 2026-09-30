import assert from "node:assert/strict";
import test from "node:test";
import { findStarterPhrase, phraseLibrary, searchPhraseLibrary } from "../../src/content/phrases.ts";
import { getRuntimeCapabilities } from "../../src/services/runtimeConfiguration.ts";
import { conversationTopics, getTopicOfTheDay } from "../../src/content/topics.ts";
import { createLocalTutorReply, stripEnglishHelpPrefix } from "../../src/services/localTutor.ts";

test("English rescue mode removes the spoken helper phrase before translation", () => {
  assert.equal(
    stripEnglishHelpPrefix("How do I say can you speak slowly again?"),
    "can you speak slowly"
  );
});

test("credential-free mode teaches a known English sentence", () => {
  const reply = createLocalTutorReply({
    mode: "english-help",
    message: "Can you speak slowly?",
    topic: "Everyday life",
    history: []
  });

  assert.equal(reply.source, "local");
  assert.match(reply.sinhala, /හෙමින්/u);
  assert.match(reply.romanized, /hemin/i);
  assert.equal(reply.notice, undefined);
});

test("unknown English requests offer a clearly labeled repair phrase without an upgrade prompt", () => {
  const reply = createLocalTutorReply({
    mode: "english-help",
    message: "My red bicycle is behind the library.",
    topic: "Everyday life",
    history: []
  });

  assert.match(reply.coaching, /phrase library/i);
  assert.match(reply.notice ?? "", /not a translation/i);
  assert.doesNotMatch(reply.coaching, /API_KEY/);
});

test("conversation mode supplies a speakable prompt and suggested reply", () => {
  const reply = createLocalTutorReply({
    mode: "conversation",
    message: "මම හොඳින් ඉන්නවා",
    topic: "Everyday life",
    history: [{ role: "learner", text: "මම හොඳින් ඉන්නවා" }]
  });

  assert.ok(reply.sinhala.length > 0);
  assert.ok(reply.english.length > 0);
  assert.ok(reply.suggestedReplies.length > 0);
});

test("a chosen topic produces a continuing question and retrieval scaffolds", () => {
  const opening = createLocalTutorReply({
    mode: "conversation",
    message: "Start a new casual conversation.",
    topic: "Food",
    startConversation: true,
    history: []
  });
  const continuation = createLocalTutorReply({
    mode: "conversation",
    message: "මම කොත්තු කන්න කැමතියි",
    topic: "Food",
    history: [{ role: "learner", text: "මම කොත්තු කන්න කැමතියි" }]
  });

  assert.match(opening.english, /like to eat/i);
  assert.match(continuation.english, /spicy food/i);
  assert.equal(continuation.suggestedReplies.length, 2);
  assert.ok(continuation.sinhala.endsWith("?"));
});

test("the daily topic is deterministic for a calendar day", () => {
  const date = new Date("2026-07-20T12:00:00Z");
  assert.equal(getTopicOfTheDay(date).id, getTopicOfTheDay(date).id);
  assert.ok(conversationTopics.some((topic) => topic.id === getTopicOfTheDay(date).id));
});

test("starter phrase lookup accepts natural English around the target", () => {
  assert.equal(findStarterPhrase("Please tell me how to say that again")?.id, "say-again");
});

test("every library phrase can be retrieved by its displayed English meaning", () => {
  assert.equal(phraseLibrary.length, 38);
  assert.equal(new Set(phraseLibrary.map((phrase) => phrase.id)).size, phraseLibrary.length);
  for (const phrase of phraseLibrary) {
    const reply = createLocalTutorReply({ mode: "english-help", message: phrase.english, topic: phrase.category, history: [] });
    assert.equal(reply.sinhala, phrase.sinhala, phrase.english);
    assert.equal(reply.romanized, phrase.romanized);
    assert.equal(reply.notice, undefined);
  }
});

test("keyword overlap and negation are not mistaken for translations", () => {
  for (const sentence of ["I am a teacher.", "I am not doing well.", "I do not want tea please.", "The meaning of life", "Where is the bathroom in the blue restaurant?"]) {
    assert.equal(findStarterPhrase(sentence), undefined, sentence);
  }
  assert.equal(findStarterPhrase("How do I say can you speak slowly again?")?.id, "speak-slowly");
  assert.equal(findStarterPhrase("How do I say can you say that again?")?.id, "say-again");
});

test("phrase search supports English, Sinhala, romanization, topic filters, and empty results", () => {
  assert.ok(searchPhraseLibrary("rice", "Food").some((phrase) => phrase.english === "I like to eat rice."));
  assert.ok(searchPhraseLibrary("හෙමින්").some((phrase) => phrase.id === "speak-slowly"));
  assert.ok(searchPhraseLibrary("hemin").some((phrase) => phrase.id === "speak-slowly"));
  assert.deepEqual(searchPhraseLibrary("rice", "Family"), []);
  assert.deepEqual(searchPhraseLibrary("nonexistent-phrase"), []);
});

test("free rounds advance independently of truncated history and finish after all prompts", () => {
  for (const topic of conversationTopics) {
    for (let step = 0; step <= topic.prompts.length; step++) {
      const reply = createLocalTutorReply({ mode: "conversation", message: "Reply", topic: topic.title, conversationStep: step, history: [] });
      assert.equal(reply.localProgress?.complete, step === topic.prompts.length);
      if (step < topic.prompts.length) assert.equal(reply.sinhala, topic.prompts[step].sinhala);
    }
    const restarted = createLocalTutorReply({ mode: "conversation", message: "Start", topic: topic.title, conversationStep: 500, startConversation: true, history: [] });
    assert.equal(restarted.localProgress?.question, 1);
    assert.equal(restarted.localProgress?.complete, false);
  }
});

test("English help and its history do not advance the guided question", () => {
  const reply = createLocalTutorReply({ mode: "conversation", message: "Reply", topic: "Food", conversationStep: 1,
    history: Array.from({ length: 12 }, () => ({ role: "learner" as const, text: "Can you speak slowly?" })) });
  assert.equal(reply.localProgress?.question, 2);
  assert.match(reply.english, /spicy food/i);
});

test("custom topics disclose general prompts", () => {
  const reply = createLocalTutorReply({ mode: "conversation", message: "Start", topic: "Astronomy", startConversation: true, history: [] });
  assert.match(reply.notice ?? "", /general saved prompts/i);
});

test("provider keys alone cannot enable billed services", () => {
  const keys = { OPENAI_API_KEY: "test-only", AZURE_SPEECH_KEY: "test-only", AZURE_SPEECH_REGION: "canadacentral" };
  for (const flag of [undefined, "false", "TRUE", "1"]) {
    assert.deepEqual(getRuntimeCapabilities({ ...keys, ENABLE_PAID_SERVICES: flag }), { liveTutor: false, azureSpeech: false });
  }
  assert.deepEqual(getRuntimeCapabilities({ ENABLE_PAID_SERVICES: "true" }), { liveTutor: false, azureSpeech: false });
  assert.deepEqual(getRuntimeCapabilities({ ...keys, ENABLE_PAID_SERVICES: "true" }), { liveTutor: true, azureSpeech: true });
});
