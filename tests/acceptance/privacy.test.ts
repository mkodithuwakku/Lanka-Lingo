import assert from "node:assert/strict";
import test from "node:test";
import { createLearnerProfile } from "../../src/services/onboarding.ts";
import { defaultPrivacyExplanation, setRawAudioRetention, shouldStoreRawAudio } from "../../src/services/privacy.ts";

test("FR-11: raw audio retention is disabled by default", () => {
  const profile = createLearnerProfile({
    id: "privacy-learner",
    background: "beginner",
    goals: ["privacy-safe practice"]
  });

  assert.equal(shouldStoreRawAudio(profile), false);
  assert.match(defaultPrivacyExplanation.rawAudioRetention, /off by default/i);
});

test("FR-11: learner can explicitly opt into and back out of audio retention", () => {
  const profile = createLearnerProfile({
    id: "privacy-learner",
    background: "beginner",
    goals: ["privacy-safe practice"]
  });

  const optedIn = setRawAudioRetention(profile, true);
  const optedOut = setRawAudioRetention(optedIn, false);

  assert.equal(shouldStoreRawAudio(optedIn), true);
  assert.equal(shouldStoreRawAudio(optedOut), false);
});
