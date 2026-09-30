import { findStarterPhrase, starterPhrases } from "../content/phrases.ts";
import { conversationTopics, customTopicFallback } from "../content/topics.ts";
import type { TutorReply, TutorRequest } from "../domain/types.ts";

const acknowledgements = [
  { sinhala: "හරි!", romanized: "hari!", english: "Okay!" },
  { sinhala: "එහෙමද?", romanized: "ehemada?", english: "Is that so?" },
  { sinhala: "හොඳයි!", romanized: "hondai!", english: "Nice!" }
];

export function createLocalTutorReply(request: TutorRequest): TutorReply {
  if (request.mode === "english-help") {
    const phrase = findStarterPhrase(request.message);
    if (phrase) {
      return {
        sinhala: phrase.sinhala,
        romanized: phrase.romanized,
        english: phrase.english,
        coaching: "Try this phrase aloud, then return to your conversation. Use Listen if a Sinhala voice is available.",
        suggestedReplies: [],
        expectedPhrase: phrase.sinhala,
        source: "local"
      };
    }

    const fallback = starterPhrases[3];
    return {
      sinhala: fallback.sinhala,
      romanized: fallback.romanized,
      english: fallback.english,
      coaching: "Choose an included phrase from the phrase library, or search for a shorter idea. Free practice uses saved phrases rather than arbitrary translation.",
      suggestedReplies: [],
      expectedPhrase: fallback.sinhala,
      source: "local",
      notice: "This is an alternative repair phrase, not a translation of your sentence. Choose a phrase from the library to practice exactly what it says."
    };
  }

  const topic = conversationTopics.find((candidate) => candidate.title === request.topic) ?? customTopicFallback;
  const learnerTurns = request.history.filter((message) => message.role === "learner").length;
  const step = request.startConversation ? 0 : Math.max(0, request.conversationStep ?? learnerTurns);
  const complete = step >= topic.prompts.length;
  const promptIndex = Math.min(step, topic.prompts.length - 1);
  const prompt = topic.prompts[promptIndex];
  const acknowledgement = acknowledgements[Math.max(0, learnerTurns - 1) % acknowledgements.length];
  const hasLearnerReply = !request.startConversation && learnerTurns > 0;

  if (complete) {
    return {
      ...acknowledgements[2],
      coaching: "Round complete. Repeat this topic to retrieve the phrases more easily, or choose another topic.",
      suggestedReplies: [],
      expectedPhrase: prompt.replies[0].sinhala,
      source: "local",
      localProgress: { question: topic.prompts.length, total: topic.prompts.length, complete: true }
    };
  }

  return {
    sinhala: hasLearnerReply ? `${acknowledgement.sinhala} ${prompt.sinhala}` : prompt.sinhala,
    romanized: hasLearnerReply ? `${acknowledgement.romanized} ${prompt.romanized}` : prompt.romanized,
    english: hasLearnerReply ? `${acknowledgement.english} ${prompt.english}` : prompt.english,
    coaching: "You already understand the question. Pause, retrieve one short Sinhala sentence, and expand only if the words come naturally.",
    suggestedReplies: prompt.replies,
    expectedPhrase: prompt.replies[0].sinhala,
    source: "local",
    localProgress: { question: promptIndex + 1, total: topic.prompts.length, complete: false },
    notice: topic === customTopicFallback
      ? "This custom topic uses general saved prompts. The questions are not tailored to the subject you entered."
      : undefined
  };
}

export { stripEnglishHelpPrefix } from "../content/phrases.ts";
