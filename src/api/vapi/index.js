// Vercel serverless function — minimal Vapi webhook for connection testing.
// No Supabase / database work here yet; that comes later.

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("Vapi request body:", JSON.stringify(req.body, null, 2));

  const toolCallId = req.body?.message?.toolCalls?.[0]?.id ?? req.body?.toolCallId;

  return res.status(200).json({
    results: [
      {
        toolCallId,
        result: "ok",
      },
    ],
  });
}