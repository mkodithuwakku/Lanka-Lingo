const SINHALA_VOICES = new Set([
  "si-LK-ThiliniNeural",
  "si-LK-SameeraNeural"
]);

export interface AzureSpeechConfiguration {
  key: string;
  region: string;
  voice: string;
}

export function getAzureSpeechConfiguration(): AzureSpeechConfiguration | null {
  const key = process.env.AZURE_SPEECH_KEY?.trim();
  const region = process.env.AZURE_SPEECH_REGION?.trim().toLowerCase();
  const voice = process.env.AZURE_SPEECH_VOICE?.trim() || "si-LK-ThiliniNeural";

  if (!key || !region) return null;

  if (!/^[a-z0-9-]+$/.test(region)) {
    throw new Error("AZURE_SPEECH_REGION contains unsupported characters.");
  }

  if (!SINHALA_VOICES.has(voice)) {
    throw new Error("AZURE_SPEECH_VOICE must be a supported si-LK voice.");
  }

  return { key, region, voice };
}

export function escapeSsml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildSinhalaSsml(text: string, voice: string, rate: number): string {
  if (!SINHALA_VOICES.has(voice)) {
    throw new Error("Unsupported Sinhala voice.");
  }

  const boundedRate = Math.min(1.2, Math.max(0.5, rate));
  const ratePercent = Math.round((boundedRate - 1) * 100);
  const prosodyRate = `${ratePercent >= 0 ? "+" : ""}${ratePercent}%`;

  return [
    '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="si-LK">',
    `<voice name="${voice}">`,
    `<prosody rate="${prosodyRate}">${escapeSsml(text)}</prosody>`,
    "</voice>",
    "</speak>"
  ].join("");
}

export async function synthesizeSinhalaSpeech(
  text: string,
  rate: number,
  configuration: AzureSpeechConfiguration
): Promise<ArrayBuffer> {
  const response = await fetch(
    `https://${configuration.region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/ssml+xml",
        "Ocp-Apim-Subscription-Key": configuration.key,
        "X-Microsoft-OutputFormat": "audio-24khz-96kbitrate-mono-mp3",
        "User-Agent": "Lanka-Lingo"
      },
      body: buildSinhalaSsml(text, configuration.voice, rate),
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(`Azure Speech returned status ${response.status}.`);
  }

  return response.arrayBuffer();
}
