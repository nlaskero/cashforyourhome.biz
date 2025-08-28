import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    // Step 1: Setup transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER, // your Gmail
        pass: process.env.SMTP_PASS, // Gmail App Password
      },
    });

    // Step 2: Verify SMTP
    await transporter.verify();

    // Step 3: Send a simple test email
    const info = await transporter.sendMail({
      from: `"Cash For Your Home Test" <${process.env.SMTP_USER}>`,
      to: "nlaskero@gmail.com", // your email
      subject: "Test Email from Vercel",
      text: "This is a simple test email to confirm SMTP is working."
    });

    return res.status(200).json({ message: "Test email sent!", info });

  } catch (error) {
    return res.status(500).json({ message: "Test email failed", error: error.message });
  }
}
