export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  console.log("Vapi request received:", req.body);

  return res.status(200).json({
    success: true,
    received: true,
    message: "Request received successfully.",
  });
} 