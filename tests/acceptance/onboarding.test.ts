import assert from "node:assert/strict";
import test from "node:test";
import { createLearnerProfile } from "../../src/services/onboarding.ts";

test("FR-1: new beginner who skips placement starts at the safest beginner level", () => {
  const profile = createLearnerProfile({
    id: "learner-1",
    background: "beginner",
    goals: ["family conversation"],
    skipPlacement: true
  });

  assert.equal(profile.level, 0);
  assert.equal(profile.captionPreference, "on");
  assert.equal(profile.romanizationEnabled, true);
  assert.equal(profile.rawAudioRetention, false);
});

test("FR-1: heritage learner starts with conversation support rather than alphabet-only lessons", () => {
  const profile = createLearnerProfile({
    id: "learner-2",
    background: "heritage",
    goals: ["talking with relatives"],
    placementTranscript: "ayubowan mama sinhala tikak dannawa"
  });

  assert.equal(profile.level, 1);
  assert.equal(profile.captionPreference, "tap-to-reveal");
  assert.deepEqual(profile.goals, ["talking with relatives"]);
});

test("FR-1: intermediate learner placement can start above the beginner path", () => {
  const profile = createLearnerProfile({
    id: "learner-3",
    background: "intermediate",
    goals: ["travel"]
  });

  assert.equal(profile.level, 2);
});
