import { NextResponse } from "next/server";
import type { TutorRequest } from "../../../src/domain/types.ts";
import { createOpenAITutorReply } from "../../../src/providers/openaiTutor.ts";
import { createLocalTutorReply, stripEnglishHelpPrefix } from "../../../src/services/localTutor.ts";
import { getRuntimeCapabilities } from "../../../src/services/runtimeConfiguration.ts";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: TutorRequest;

  try {
    body = (await request.json()) as TutorRequest;
  } catch {
    return NextResponse.json({ error: "The request body must be valid JSON." }, { status: 400 });
  }

  if (
    !body ||
    (body.mode !== "conversation" && body.mode !== "english-help") ||
    typeof body.message !== "string" ||
    !body.message.trim() ||
    body.message.length > 800 ||
    typeof body.topic !== "string" ||
    !body.topic.trim() ||
    body.topic.length > 120 ||
    !Array.isArray(body.history) ||
    body.history.some((item) => !item || typeof item !== "object" || typeof item.text !== "string") ||
    (body.conversationStep !== undefined && (!Number.isSafeInteger(body.conversationStep) || body.conversationStep < 0))
  ) {
    return NextResponse.json({ error: "A valid mode, message, and history are required." }, { status: 400 });
  }

  const normalized: TutorRequest = {
    mode: body.mode,
    message: body.mode === "english-help" ? stripEnglishHelpPrefix(body.message) || body.message.trim() : body.message.trim(),
    topic: body.topic.trim(),
    startConversation: body.startConversation === true,
    conversationStep: body.conversationStep,
    history: body.history.slice(-12).map((item) => ({
      role: item.role === "tutor" ? "tutor" : "learner",
      text: String(item.text || "").slice(0, 800),
      english: item.english ? String(item.english).slice(0, 800) : undefined
    }))
  };

  if (!getRuntimeCapabilities().liveTutor) {
    return NextResponse.json(createLocalTutorReply(normalized));
  }

  try {
    return NextResponse.json(await createOpenAITutorReply(normalized));
  } catch (error) {
    console.error("OpenAI tutor request failed", error);
    const fallback = createLocalTutorReply(normalized);
    return NextResponse.json({
      ...fallback,
      notice: "The live tutor was unavailable, so Lanka Lingo switched to its local starter responses."
    });
  }
}
