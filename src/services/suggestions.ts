import type { LearnerProfile, Scenario, SuggestedReply } from "../domain/types.ts";

export function generateSuggestedReplies(profile: LearnerProfile, scenario: Scenario): SuggestedReply[] {
  const currentLevelPhrases = scenario.targetPhrases.filter((phrase) => phrase.level <= profile.level);
  const base = currentLevelPhrases.length > 0 ? currentLevelPhrases : scenario.targetPhrases.slice(0, 2);

  return base.slice(0, 3).map((phrase) => ({
    english: phrase.english,
    romanizedSinhala: phrase.romanizedSinhala,
    sinhalaScript: phrase.sinhalaScript,
    difficulty: phrase.level <= profile.level ? "current" : "stretch"
  }));
}
