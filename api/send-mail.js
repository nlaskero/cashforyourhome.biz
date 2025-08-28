import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ step: "method", error: "Only POST allowed" });
  }

  try {
    // Log raw body (for debugging form parsing)
    console.log("Raw body:", req.body);

    const { "property-address": address, "property-condition": condition, timeline, "seller-name": name, "seller-phone": phone, email } = req.body;

    // Debug log
    console.log("Parsed fields:", { address, condition, timeline, name, phone, email });

    // Setup transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER, // e.g. nick@gmail.com
        pass: process.env.SMTP_PASS, // Gmail app password
      },
    });

    // Verify SMTP connection
    await transporter.verify();
    console.log("SMTP connection successful");

    // Try sending mail
    const info = await transporter.sendMail({
      from: `"Cash For Your Home" <${process.env.SMTP_USER}>`,
      to: "nick@gmail.com", // or your client’s email
      subject: "New Cash Offer Request",
      text: `
        🏠 Address: ${address}
        🔧 Condition: ${condition}
        📅 Timeline: ${timeline}
        👤 Name: ${name}
        📞 Phone: ${phone}
        ✉️ Email: ${email}
      `,
    });

    console.log("Email sent:", info.messageId);

    return res.status(200).json({ step: "done", message: "Email sent", info });

  } catch (error) {
    console.error("Error step:", error);
    return res.status(500).json({ step: "failed", error: error.message });
  }
}
