export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, service, date, time, reference } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Nailedit.GH <onboarding@resend.dev>",
        to: [email],
        subject: "Your Nailedit.GH Appointment is Confirmed ✨",
        html: `
          <h2>Appointment Confirmed ✨</h2>
          <p>Hi ${name},</p>
          <p>Thank you for booking with <strong>Nailedit.GH</strong>.</p>
          <p>Your payment has been received and your appointment is confirmed.</p>

          <p><strong>Service:</strong> ${service || "—"}</p>
          <p><strong>Date:</strong> ${date || "—"}</p>
          <p><strong>Time:</strong> ${time || "—"}</p>
          <p><strong>Payment reference:</strong> ${reference || "—"}</p>

          <p>We can't wait to see you! 💅🏽</p>
          <p><strong>Nailedit.GH</strong></p>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Could not send confirmation email" });
  }
}
