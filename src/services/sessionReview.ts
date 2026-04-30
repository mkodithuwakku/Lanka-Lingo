import type { ConversationSession } from "../domain/types.ts";

export interface SessionReview {
  practicedPhrases: string[];
  pronunciationNotes: string[];
  nextStep: string;
}

export function summarizeSession(session: ConversationSession): SessionReview {
  const practicedPhrases = new Set<string>();
  const pronunciationNotes: string[] = [];

  for (const turn of session.turns) {
    for (const reply of turn.suggestedReplies) {
      practicedPhrases.add(reply.romanizedSinhala);
    }

    if (turn.pronunciationFeedback.messageEnglish) {
      pronunciationNotes.push(turn.pronunciationFeedback.messageEnglish);
    }
  }

  return {
    practicedPhrases: Array.from(practicedPhrases).slice(0, 5),
    pronunciationNotes: pronunciationNotes.slice(0, 2),
    nextStep:
      session.completedObjectives.length > 0
        ? "Continue with a related conversation and try one phrase without hints."
        : "Repeat this guided conversation once more with slower pacing."
  };
}
