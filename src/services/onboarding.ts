import type { LearnerProfile, OnboardingInput } from "../domain/types.ts";

export function createLearnerProfile(input: OnboardingInput): LearnerProfile {
  return {
    id: input.id,
    background: input.background,
    goals: input.goals,
    level: placeLearner(input),
    supportLanguage: "en",
    captionPreference: input.background === "beginner" ? "on" : "tap-to-reveal",
    correctionPreference: "gentle",
    romanizationEnabled: true,
    rawAudioRetention: false
  };
}

export function placeLearner(input: OnboardingInput): LearnerProfile["level"] {
  if (input.skipPlacement) {
    return 0;
  }

  if (input.background === "intermediate") {
    return 2;
  }

  if (input.background === "heritage") {
    return 1;
  }

  const transcript = input.placementTranscript?.trim();
  return transcript && transcript.length > 20 ? 1 : 0;
}
