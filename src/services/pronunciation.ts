import type { PronunciationFeedback, SpeechSignal } from "../domain/types.ts";

const MIN_CONFIDENCE = 0.68;
const MIN_VOLUME_DB = -45;

export function evaluatePronunciation(signal: SpeechSignal): PronunciationFeedback {
  if (signal.volumeDb !== undefined && signal.volumeDb < MIN_VOLUME_DB) {
    return {
      status: "note",
      messageEnglish: "I could not hear that clearly. Try moving closer or speaking a little louder.",
      targetPhrase: signal.expectedPhrase,
      recognizedPhrase: signal.transcript
    };
  }

  if (!signal.expectedPhrase) {
    return {
      status: signal.confidence < MIN_CONFIDENCE ? "note" : "none",
      messageEnglish:
        signal.confidence < MIN_CONFIDENCE
          ? "I may not have heard that clearly. Try that one more time, a little slower."
          : "",
      recognizedPhrase: signal.transcript
    };
  }

  const similarity = phraseSimilarity(signal.transcript, signal.expectedPhrase);

  if (signal.confidence < MIN_CONFIDENCE && similarity < 0.72) {
    return {
      status: "retry",
      messageEnglish: "Let's try that one more time, a little slower. Listen first, then repeat.",
      targetPhrase: signal.expectedPhrase,
      recognizedPhrase: signal.transcript
    };
  }

  if (signal.confidence >= MIN_CONFIDENCE || similarity >= 0.72) {
    return {
      status: "improvement",
      messageEnglish: "That was clearer. Keep the same pace and continue.",
      targetPhrase: signal.expectedPhrase,
      recognizedPhrase: signal.transcript
    };
  }

  return {
    status: "none",
    messageEnglish: "",
    targetPhrase: signal.expectedPhrase,
    recognizedPhrase: signal.transcript
  };
}

export function phraseSimilarity(a: string, b: string): number {
  const left = normalize(a);
  const right = normalize(b);
  if (!left || !right) {
    return 0;
  }

  const distance = levenshtein(left, right);
  return 1 - distance / Math.max(left.length, right.length);
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function levenshtein(a: string, b: string): number {
  const rows = Array.from({ length: a.length + 1 }, (_, index) => [index]);
  for (let col = 1; col <= b.length; col += 1) {
    rows[0][col] = col;
  }

  for (let row = 1; row <= a.length; row += 1) {
    for (let col = 1; col <= b.length; col += 1) {
      const cost = a[row - 1] === b[col - 1] ? 0 : 1;
      rows[row][col] = Math.min(
        rows[row - 1][col] + 1,
        rows[row][col - 1] + 1,
        rows[row - 1][col - 1] + cost
      );
    }
  }

  return rows[a.length][b.length];
}
