import { NextRequest, NextResponse } from "next/server";

const TO_EMAILS = (
  process.env.CUSTOM_REQUEST_TO ?? "alliecablayan@icloud.com,markcabs26@gmail.com"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const FROM = process.env.RESEND_FROM ?? "Axloxo <orders@axloxo.com>";

type ResendMessage = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  reply_to?: string;
};

async function sendEmail(apiKey: string, msg: ResendMessage, label: string) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msg),
    });
    if (!res.ok) {
      console.error(`[custom-request] Resend ${label} failed:`, await res.text());
    }
  } catch (e) {
    console.error(`[custom-request] Resend ${label} error:`, e);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { name, email, phone, colors, size, occasion, notes } = body as Record<
    string,
    string
  >;

  if (!name?.trim() || !colors?.trim()) {
    return NextResponse.json(
      { error: "Please fill in your name and colors." },
      { status: 400 }
    );
  }
  if (!email?.trim() && !phone?.trim()) {
    return NextResponse.json(
      { error: "Please give us either an email or a phone number." },
      { status: 400 }
    );
  }

  const submission = {
    receivedAt: new Date().toISOString(),
    name,
    email: email || "(not provided)",
    phone: phone || "(not provided)",
    colors,
    size: size || "(not specified)",
    occasion: occasion || "(not specified)",
    notes: notes || "",
  };

  console.log("[custom-request]", JSON.stringify(submission, null, 2));

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    await sendEmail(
      apiKey,
      {
        from: FROM,
        to: TO_EMAILS,
        reply_to: email || undefined,
        subject: `Custom bracelet request from ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${submission.email}`,
          `Phone: ${submission.phone}`,
          `Colors: ${colors}`,
          `Size: ${submission.size}`,
          `Occasion: ${submission.occasion}`,
          "",
          "Notes:",
          submission.notes || "(none)",
        ].join("\n"),
      },
      "notification"
    );

    if (email?.trim()) {
      await sendEmail(
        apiKey,
        {
          from: FROM,
          to: [email],
          subject: "Thanks for your custom bracelet request!",
          text: [
            `Hi ${name},`,
            "",
            "Thanks so much for reaching out — Allie got your custom bracelet request and is excited to take a look!",
            "",
            "Here's what we have on file:",
            `  Colors: ${colors}`,
            `  Size: ${submission.size}`,
            `  Occasion: ${submission.occasion}`,
            submission.notes ? `  Notes: ${submission.notes}` : "",
            "",
            "She'll get back to you within a day or two with a couple of design ideas and a price quote (usually $2–$20 depending on beads and charms). Once you approve, she'll make it and ship it out — usually within a week.",
            "",
            "If you need to add anything to your request, just reply to this email.",
            "",
            "Talk soon!",
            "— Allie",
            "Axloxo · axloxo.com",
          ]
            .filter(Boolean)
            .join("\n"),
        },
        "confirmation"
      );
    }
  }

  return NextResponse.json({ ok: true });
}
