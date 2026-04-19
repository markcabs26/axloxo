import { NextRequest, NextResponse } from "next/server";

const TO_EMAIL = process.env.CUSTOM_REQUEST_TO ?? "mark@payready.com";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { name, email, colors, size, occasion, notes } = body as Record<
    string,
    string
  >;

  if (!name?.trim() || !email?.trim() || !colors?.trim()) {
    return NextResponse.json(
      { error: "Please fill in your name, email, and colors." },
      { status: 400 }
    );
  }

  const submission = {
    receivedAt: new Date().toISOString(),
    name,
    email,
    colors,
    size: size || "(not specified)",
    occasion: occasion || "(not specified)",
    notes: notes || "",
  };

  console.log("[custom-request]", JSON.stringify(submission, null, 2));

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM ?? "Axloxo <orders@axloxo.com>",
          to: [TO_EMAIL],
          reply_to: email,
          subject: `Custom bracelet request from ${name}`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Colors: ${colors}`,
            `Size: ${submission.size}`,
            `Occasion: ${submission.occasion}`,
            "",
            "Notes:",
            submission.notes || "(none)",
          ].join("\n"),
        }),
      });
      if (!res.ok) {
        console.error("[custom-request] Resend failed:", await res.text());
      }
    } catch (e) {
      console.error("[custom-request] Resend error:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
