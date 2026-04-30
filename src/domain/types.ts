export type LearnerLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type LearnerBackground = "beginner" | "heritage" | "intermediate";

export type ConversationMode =
  | "guided"
  | "free-talk"
  | "repeat-and-repair"
  | "roleplay"
  | "listening-first"
  | "review";

export type ProgressEventType =
  | "objective_practiced"
  | "phrase_reused"
  | "comprehension_signal"
  | "pronunciation_signal";

export interface LearnerProfile {
  id: string;
  background: LearnerBackground;
  goals: string[];
  level: LearnerLevel;
  supportLanguage: "en";
  captionPreference: "on" | "tap-to-reveal" | "off";
  correctionPreference: "gentle" | "balanced";
  romanizationEnabled: boolean;
  rawAudioRetention: boolean;
}

export interface OnboardingInput {
  id: string;
  background: LearnerBackground;
  goals: string[];
  placementTranscript?: string;
  skipPlacement?: boolean;
}

export interface Phrase {
  id: string;
  romanizedSinhala: string;
  english: string;
  sinhalaScript?: string;
  level: LearnerLevel;
  tags: string[];
}

export interface Scenario {
  id: string;
  title: string;
  level: LearnerLevel;
  mode: ConversationMode;
  objective: string;
  setting: string;
  targetPhrases: Phrase[];
  culturalNotes: string[];
  releaseStatus: "draft" | "review" | "release-ready" | "published";
  reviewerApprovals: string[];
}

export interface SuggestedReply {
  english: string;
  romanizedSinhala: string;
  sinhalaScript?: string;
  difficulty: "current" | "stretch";
}

export interface SpeechSignal {
  transcript: string;
  confidence: number;
  volumeDb?: number;
  expectedPhrase?: string;
}

export interface PronunciationFeedback {
  status: "none" | "retry" | "improvement" | "note";
  messageEnglish: string;
  targetPhrase?: string;
  recognizedPhrase?: string;
}

export interface ProgressEvent {
  type: ProgressEventType;
  value: string;
}

export interface TutorTurn {
  tutorSinhala: string;
  romanizedSinhala: string;
  englishCaption: string;
  suggestedReplies: SuggestedReply[];
  pronunciationFeedback: PronunciationFeedback;
  progressEvents: ProgressEvent[];
}

export interface ConversationSession {
  id: string;
  scenarioId: string;
  learnerId: string;
  completedObjectives: string[];
  turns: TutorTurn[];
}
