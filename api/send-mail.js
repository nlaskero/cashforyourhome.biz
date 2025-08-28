import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    // Step 1: Setup transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // your burner email
        pass: process.env.SMTP_PASS, // app password or example "123"
      },
    });

    // Step 2: Verify SMTP
    await transporter.verify();

    // Step 3: Send email
    const info = await transporter.sendMail({
      from: `"Cash For Your Home" <${process.env.SMTP_USER}>`,
      to: "nlaskero@gmail.com", // your personal email
      subject: "Test Email from Vercel",
      text: "This is a test email from your burner account.",
    });

    return res.status(200).json({ message: "Test email sent!", info });
  } catch (error) {
    return res.status(500).json({ message: "Test email failed", error: error.message });
  }
}
