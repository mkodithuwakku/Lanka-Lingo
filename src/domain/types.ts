export type PracticeMode = "conversation" | "english-help";

export type MessageLanguage = "si" | "en";

export interface ConversationMessage {
  id: string;
  role: "learner" | "tutor";
  language: MessageLanguage;
  text: string;
  romanized?: string;
  english?: string;
  notice?: string;
}

export interface TutorRequest {
  mode: PracticeMode;
  message: string;
  topic: string;
  startConversation?: boolean;
  conversationStep?: number;
  history: Array<Pick<ConversationMessage, "role" | "text" | "english">>;
}

export interface TutorReply {
  sinhala: string;
  romanized: string;
  english: string;
  coaching: string;
  suggestedReplies: Array<{
    sinhala: string;
    romanized: string;
    english: string;
  }>;
  expectedPhrase: string;
  source: "local" | "openai";
  notice?: string;
  localProgress?: { question: number; total: number; complete: boolean };
}

export interface SpeechSignal {
  transcript: string;
  confidence: number;
  expectedPhrase?: string;
}

export interface PronunciationFeedback {
  status: "ready" | "retry" | "close" | "great";
  score: number;
  messageEnglish: string;
  targetPhrase?: string;
  recognizedPhrase: string;
}
