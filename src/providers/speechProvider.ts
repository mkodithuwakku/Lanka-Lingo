export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  volumeDb?: number;
}

export interface SpeechProvider {
  recognizeSinhala(audio: ArrayBuffer): Promise<SpeechRecognitionResult>;
  synthesizeSinhala(text: string, voice?: "si-LK-ThiliniNeural" | "si-LK-SameeraNeural"): Promise<ArrayBuffer>;
}

export class ProviderNotConfiguredError extends Error {
  constructor(provider: string) {
    super(`${provider} is not configured. Add credentials before enabling live speech.`);
  }
}

export class AzureSpeechProvider implements SpeechProvider {
  async recognizeSinhala(): Promise<SpeechRecognitionResult> {
    throw new ProviderNotConfiguredError("Azure Speech");
  }

  async synthesizeSinhala(): Promise<ArrayBuffer> {
    throw new ProviderNotConfiguredError("Azure Speech");
  }
}
