import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { isDemoOrg } from "@/lib/demo-data";
import { mixWithBeat } from "@/lib/audio-mixer";
import { readFile } from "fs/promises";
import { join } from "path";

const VOICE_ID = "TX3LPaxmHKxFdv7VOQHJ";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (session.instanceUrl && isDemoOrg(session.instanceUrl)) {
    const filePath = join(process.cwd(), "public", "demo-roast.mp3");
    const audioBuffer = await readFile(filePath);
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  }

  const { text } = await request.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.3,
            similarity_boost: 0.75,
            style: 0.7,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("ElevenLabs error:", error);
      return NextResponse.json(
        { error: "Voice generation failed" },
        { status: response.status }
      );
    }

    const voiceBuffer = Buffer.from(await response.arrayBuffer());
    const mixedBuffer = await mixWithBeat(voiceBuffer);

    const responseBody = new Uint8Array(mixedBuffer);
    return new NextResponse(responseBody, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": mixedBuffer.byteLength.toString(),
      },
    });
  } catch (err) {
    console.error("TTS/mixing failed:", err);
    return NextResponse.json({ error: "Voice generation failed" }, { status: 500 });
  }
}
