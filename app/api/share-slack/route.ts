import { NextRequest, NextResponse } from "next/server";

const CATEGORY_ICONS: Record<string, string> = {
  metadata: "🗃️",
  code: "💻",
  security: "🔒",
  config: "⚙️",
  limits: "📊",
  agentforce: "🤖",
  datacloud: "☁️",
};

interface SlackFinding {
  category: string;
  title: string;
  severity: number;
}

interface SlackPayload {
  score: number;
  letter: string;
  label: string;
  findings: SlackFinding[];
}

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  const channelId = process.env.SLACK_CHANNEL_ID;

  if (!webhookUrl && !channelId) {
    return NextResponse.json({ error: "Slack not configured" }, { status: 501 });
  }

  const { score, letter, label, findings } = (await req.json()) as SlackPayload;

  const findingLines = findings
    .slice(0, 5)
    .map((f) => {
      const icon = CATEGORY_ICONS[f.category] || "📋";
      const flames = "🔥".repeat(f.severity) + "  ".repeat(5 - f.severity);
      return `${icon}  *${f.title}*  ${flames}`;
    })
    .join("\n");

  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: "🎤 ORG ROAST RESULTS 🔥" },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Score: ${score}/100* — Grade: *${letter}*\n_"${label}"_`,
      },
    },
    { type: "divider" },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Top Issues:*\n${findingLines}`,
      },
    },
    { type: "divider" },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "Think your org is cleaner? Step up to the mic. 🎤",
        },
      ],
    },
  ];

  if (channelId && !webhookUrl) {
    return NextResponse.json({ ok: true });
  }

  const res = await fetch(webhookUrl!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocks }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to post to Slack" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
