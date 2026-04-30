import type { LearnerProfile } from "../domain/types.ts";

export interface PrivacyExplanation {
  microphone: string;
  rawAudioRetention: string;
  transcripts: string;
}

export const defaultPrivacyExplanation: PrivacyExplanation = {
  microphone: "Microphone access is used only to hear your spoken Sinhala during practice.",
  rawAudioRetention: "Raw audio is off by default and is stored only if you explicitly opt in.",
  transcripts: "Transcripts and learning progress can be saved so the tutor can personalize future practice."
};

export function setRawAudioRetention(profile: LearnerProfile, enabled: boolean): LearnerProfile {
  return {
    ...profile,
    rawAudioRetention: enabled
  };
}

export function shouldStoreRawAudio(profile: LearnerProfile): boolean {
  return profile.rawAudioRetention === true;
}
