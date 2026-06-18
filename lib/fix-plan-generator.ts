import { GoogleGenerativeAI } from "@google/generative-ai";
import { Finding } from "./analyzers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_INSTRUCTION = `You are a senior Salesforce architect creating a prioritized action plan for an admin who just received an org health report.

Rules:
- Produce exactly 3–5 action items based on the findings provided
- Order by impact: highest-impact fix first
- Each item MUST follow this exact format on a single line:
  [EFFORT] Title — One sentence describing the specific action to take.
- EFFORT must be one of: QUICK WIN, MEDIUM, LARGE
- Be specific and practical — reference real Salesforce tools, setup pages, or features
- Do NOT repeat the finding description — jump straight to the fix
- Do NOT use markdown headers, bullet points, or numbered lists — just the raw lines separated by blank lines
- Keep the total response under 200 words`;

const CLEAN_ORG_PLAN =
  "[QUICK WIN] Celebrate — Your org is clean. Go get coffee and tell your team they're doing great.";

function buildFindingsSummary(findings: Finding[]): string {
  return findings
    .map(
      (f, i) =>
        `${i + 1}. [${f.category.toUpperCase()}] ${f.title} (severity: ${f.severity}/5): ${f.description}`
    )
    .join("\n");
}

export async function* generateFixPlanStream(
  findings: Finding[]
): AsyncGenerator<string> {
  if (findings.length === 0) {
    yield CLEAN_ORG_PLAN;
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
        parts: [
          {
            text: `Here are the findings from a Salesforce org health scan. Create a prioritized action plan:\n\n${buildFindingsSummary(findings)}`,
          },
        ],
      },
    ],
    generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
  });

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}
