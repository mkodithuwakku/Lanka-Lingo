import assert from "node:assert/strict";
import test from "node:test";
import { evaluatePronunciation, phraseSimilarity } from "../../src/services/pronunciation.ts";

test("Sinhala Unicode is preserved when comparing a recognized phrase", () => {
  assert.equal(phraseSimilarity("මම හොඳින් ඉන්නවා.", "මම හොඳින් ඉන්නවා"), 1);
});

test("a clear transcript match is reported without claiming phoneme scoring", () => {
  const feedback = evaluatePronunciation({
    transcript: "ආයෙත් කියන්න පුළුවන්ද",
    confidence: 0.88,
    expectedPhrase: "ආයෙත් කියන්න පුළුවන්ද?"
  });

  assert.equal(feedback.status, "great");
  assert.equal(feedback.score, 100);
  assert.match(feedback.messageEnglish, /matched the target/i);
});

test("a weak recognition result asks for another attempt", () => {
  const feedback = evaluatePronunciation({
    transcript: "කියන්න",
    confidence: 0.25,
    expectedPhrase: "ආයෙත් කියන්න පුළුවන්ද?"
  });

  assert.equal(feedback.status, "retry");
  assert.ok(feedback.score < 65);
});

test("Sinhala vowel marks affect the score while punctuation and joiners do not", () => {
  assert.notEqual(phraseSimilarity("ක", "කා"), 1);
  assert.notEqual(phraseSimilarity("කි", "කු"), 1);
  assert.equal(phraseSimilarity("ශ්‍රී!", "ශ්රී"), 1);
});
