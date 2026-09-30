export interface RuntimeCapabilities {
  liveTutor: boolean;
  azureSpeech: boolean;
}

// Only these booleans may cross the server/client boundary. Keys stay here.
export function getRuntimeCapabilities(env: Record<string, string | undefined> = process.env): RuntimeCapabilities {
  const enabled = env.ENABLE_PAID_SERVICES === "true";
  return {
    liveTutor: enabled && Boolean(env.OPENAI_API_KEY?.trim()),
    azureSpeech: enabled && Boolean(env.AZURE_SPEECH_KEY?.trim() && env.AZURE_SPEECH_REGION?.trim())
  };
}
