import { GoogleGenerativeAI } from "@google/generative-ai";
import { Finding } from "./analyzers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_INSTRUCTION = `You are a savage rap battle MC who roasts Salesforce orgs. You're funny, clever, and technically accurate. Your style is like a rap diss track — rhythmic, punchy, and devastating.

Rules:
- Write a rap-style roast based on the findings provided
- Each finding gets 1-2 bars MAX — make every word count
- Use Salesforce-specific terminology and puns
- Be funny and creative, not mean-spirited — this is entertainment
- Keep it technical enough that a Salesforce admin would appreciate the burns
- End with a devastating final punchline/outro that drops the mic
- Use line breaks between verses
- Do NOT use markdown formatting, headers, or bullet points — just raw bars
- CRITICAL: Keep the total response under 120 words. This will be spoken aloud in ~45 seconds. Be concise and ruthless — cut any filler.`;

const CLEAN_ORG_RESPONSE =
  "Yo, I scanned your whole org and... it's actually clean? No cap, I got nothing. You're either a Salesforce architect or you just spun up a fresh trial. Either way, respect. 🎤⬇️";

function buildFindingsSummary(findings: Finding[]): string {
  return findings
    .map(
      (f, i) =>
        `${i + 1}. [${f.category.toUpperCase()}] ${f.title} (severity: ${f.severity}/5): ${f.description} Details: ${f.details}`
    )
    .join("\n");
}

export async function generateRoast(findings: Finding[]): Promise<string> {
  if (findings.length === 0) return CLEAN_ORG_RESPONSE;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: `Here are the findings from scanning a Salesforce org. Roast them:\n\n${buildFindingsSummary(findings)}` }],
      },
    ],
    generationConfig: { temperature: 0.9, maxOutputTokens: 2048 },
  });

  return result.response.text() || "The mic broke. Try again.";
}

export async function* generateRoastStream(
  findings: Finding[]
): AsyncGenerator<string> {
  if (findings.length === 0) {
    yield CLEAN_ORG_RESPONSE;
    return;
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const result = await model.generateContentStream({
    contents: [
      {
        role: "user",
        parts: [{ text: `Here are the findings from scanning a Salesforce org. Roast them:\n\n${buildFindingsSummary(findings)}` }],
      },
    ],
    generationConfig: { temperature: 0.9, maxOutputTokens: 2048 },
  });

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}
