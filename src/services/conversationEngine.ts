import type { LearnerProfile, Scenario, SpeechSignal, TutorTurn } from "../domain/types.ts";
import { evaluatePronunciation } from "./pronunciation.ts";
import { generateSuggestedReplies } from "./suggestions.ts";

export interface ConversationTurnInput {
  profile: LearnerProfile;
  scenario: Scenario;
  speech: SpeechSignal;
}

export function createTutorTurn(input: ConversationTurnInput): TutorTurn {
  const pronunciationFeedback = evaluatePronunciation(input.speech);
  const suggestedReplies = generateSuggestedReplies(input.profile, input.scenario);
  const firstSuggestion = suggestedReplies[0];

  return {
    tutorSinhala: firstSuggestion?.sinhalaScript ?? "හොඳයි, අපි තව ටිකක් කතා කරමු.",
    romanizedSinhala: firstSuggestion?.romanizedSinhala ?? "hondai, api thawa tikak katha karamu",
    englishCaption: buildEnglishCaption(input.scenario.objective, pronunciationFeedback.status),
    suggestedReplies,
    pronunciationFeedback,
    progressEvents: [
      {
        type: "objective_practiced",
        value: input.scenario.objective
      },
      {
        type: "pronunciation_signal",
        value: pronunciationFeedback.status
      }
    ]
  };
}

function buildEnglishCaption(objective: string, pronunciationStatus: string): string {
  if (pronunciationStatus === "retry") {
    return "Try the phrase again slowly, then continue the conversation.";
  }

  return `Practice goal: ${objective}`;
}
