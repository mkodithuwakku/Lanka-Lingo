import OpenAI from "openai";
import type { TutorReply, TutorRequest } from "../domain/types.ts";

const tutorReplySchema = {
  type: "object",
  additionalProperties: false,
  required: ["sinhala", "romanized", "english", "coaching", "suggestedReplies", "expectedPhrase"],
  properties: {
    sinhala: { type: "string" },
    romanized: { type: "string" },
    english: { type: "string" },
    coaching: { type: "string" },
    expectedPhrase: { type: "string" },
    suggestedReplies: {
      type: "array",
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["sinhala", "romanized", "english"],
        properties: {
          sinhala: { type: "string" },
          romanized: { type: "string" },
          english: { type: "string" }
        }
      }
    }
  }
} as const;

export async function createOpenAITutorReply(request: TutorRequest): Promise<TutorReply> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.6",
    store: false,
    max_output_tokens: 700,
    instructions: [
      "You are Lanka Lingo, a warm private Sinhala conversation partner for one adult heritage learner.",
      "The learner understands spoken Sinhala fully but sometimes cannot retrieve a sentence when speaking. Do not treat them like a comprehension beginner.",
      "Use neutral everyday colloquial Sri Lankan Sinhala and one casual recommended phrasing, not formal or literary alternatives.",
      "Keep turns short enough to speak aloud. Never claim to perform phoneme-level pronunciation assessment.",
      "Always provide Sinhala script, a practical Latin-letter romanization, and a concise English meaning.",
      "In conversation mode, briefly acknowledge the meaning of the learner's answer, stay on the chosen topic, and always ask one natural follow-up in Sinhala so the conversation never stalls.",
      "Suggested replies are retrieval scaffolds: provide two short casual Sinhala answers, but do not force the learner to copy them.",
      "In english-help mode, translate the learner's intended English sentence, briefly explain natural usage, and set expectedPhrase to the exact Sinhala phrase to practice.",
      "Prefer everyday phrasing. Flag ambiguity briefly in coaching instead of inventing context."
    ].join(" "),
    input: JSON.stringify({
      mode: request.mode,
      topic: request.topic,
      startingANewConversation: request.startConversation === true,
      learnerMessage: request.message,
      recentConversation: request.history.slice(-10)
    }),
    text: {
      format: {
        type: "json_schema",
        name: "sinhala_tutor_reply",
        strict: true,
        schema: tutorReplySchema
      }
    }
  });

  if (!response.output_text) {
    throw new Error("The tutor returned no text.");
  }

  const parsed = JSON.parse(response.output_text) as Omit<TutorReply, "source">;
  return { ...parsed, source: "openai" };
}
