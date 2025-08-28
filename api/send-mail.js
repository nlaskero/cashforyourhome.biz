import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  const { address, condition, timeline, name, phone, email } = req.body;

  // Setup transporter (using Gmail SMTP as example)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER, // your email
      pass: process.env.SMTP_PASS, // your app password
    },
  });

  try {
    await transporter.sendMail({
      from: `"Cash For Your Home" <${process.env.SMTP_USER}>`,
      to: "yourcustomer@email.com", // your inbox
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

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email" });
  }
}
