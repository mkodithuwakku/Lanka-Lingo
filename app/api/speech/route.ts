import { NextResponse } from "next/server";
import { getRuntimeCapabilities } from "../../../src/services/runtimeConfiguration.ts";
import {
  getAzureSpeechConfiguration,
  synthesizeSinhalaSpeech
} from "../../../src/providers/azureSpeech.ts";

export const runtime = "nodejs";

interface SpeechRequest {
  text?: unknown;
  rate?: unknown;
}

export async function POST(request: Request) {
  let body: SpeechRequest;

  try {
    body = (await request.json()) as SpeechRequest;
  } catch {
    return NextResponse.json({ error: "The request body must be valid JSON." }, { status: 400 });
  }

  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const rate = typeof body?.rate === "number" ? body.rate : 0.88;

  if (!text || text.length > 500 || !/[\u0D80-\u0DFF]/u.test(text)) {
    return NextResponse.json({ error: "A Sinhala phrase of 500 characters or fewer is required." }, { status: 400 });
  }

  if (!Number.isFinite(rate) || rate < 0.5 || rate > 1.2) {
    return NextResponse.json({ error: "Playback rate must be between 0.5 and 1.2." }, { status: 400 });
  }

  let configuration;
  if (!getRuntimeCapabilities().azureSpeech) {
    return NextResponse.json(
      { code: "speech_not_configured", error: "Cloud speech is disabled. Use an installed Sinhala voice or continue with text practice." },
      { status: 503 }
    );
  }
  try {
    configuration = getAzureSpeechConfiguration();
  } catch (error) {
    console.error("Azure Speech configuration is invalid", error);
    return NextResponse.json(
      { code: "speech_misconfigured", error: "Sinhala speech is not configured correctly." },
      { status: 503 }
    );
  }

  if (!configuration) {
    return NextResponse.json(
      { code: "speech_not_configured", error: "Sinhala speech is not configured." },
      { status: 503 }
    );
  }

  try {
    const audio = await synthesizeSinhalaSpeech(text, rate, configuration);
    return new Response(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Azure Sinhala speech request failed", error);
    return NextResponse.json(
      { code: "speech_unavailable", error: "Sinhala speech is temporarily unavailable." },
      { status: 502 }
    );
  }
}
