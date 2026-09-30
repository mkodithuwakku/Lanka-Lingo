import type { PronunciationFeedback, SpeechSignal } from "../domain/types.ts";

const LOW_RECOGNITION_CONFIDENCE = 0.45;

export function evaluatePronunciation(signal: SpeechSignal): PronunciationFeedback {
  const expected = signal.expectedPhrase?.trim();

  if (!expected || !signal.transcript.trim()) {
    return {
      status: "ready",
      score: 0,
      messageEnglish: "I did not catch a complete phrase. Move closer to the microphone and try once more.",
      targetPhrase: expected,
      recognizedPhrase: signal.transcript
    };
  }

  const similarity = phraseSimilarity(signal.transcript, expected);
  const score = Math.round(similarity * 100);

  if (signal.confidence < LOW_RECOGNITION_CONFIDENCE && similarity < 0.55) {
    return {
      status: "retry",
      score,
      messageEnglish: "The microphone was unsure what it heard. Listen again, then repeat the phrase slowly.",
      targetPhrase: expected,
      recognizedPhrase: signal.transcript
    };
  }

  if (similarity >= 0.88) {
    return {
      status: "great",
      score,
      messageEnglish: "That matched the target clearly. Say it once more at a natural pace to lock it in.",
      targetPhrase: expected,
      recognizedPhrase: signal.transcript
    };
  }

  if (similarity >= 0.65) {
    return {
      status: "close",
      score,
      messageEnglish: "Very close. Compare what the microphone heard with the target, then try the full phrase again.",
      targetPhrase: expected,
      recognizedPhrase: signal.transcript
    };
  }

  return {
    status: "retry",
    score,
    messageEnglish: "The recognized words differ from the target. Compare the text and try again; recognition can make mistakes too.",
    targetPhrase: expected,
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
  return Math.max(0, 1 - distance / Math.max(left.length, right.length));
}

function normalize(value: string): string {
  return value
    .normalize("NFC")
    .toLocaleLowerCase("si-LK")
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "")
    .trim();
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
