require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// POST /api/contact — envoie le message par email
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Adresse email invalide." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_TO || process.env.MAIL_USER,
    replyTo: email,
    subject: `[Portfolio] Message de ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #060a10; color: #e2e8f0; border-radius: 8px; border: 1px solid rgba(0,229,255,0.2);">
        <h2 style="color: #00e5ff; margin-bottom: 20px;">Nouveau message depuis ton portfolio</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; color: #94a3b8; width: 100px; vertical-align: top;">Nom :</td>
            <td style="padding: 10px; font-weight: bold;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #94a3b8; vertical-align: top;">Email :</td>
            <td style="padding: 10px;"><a href="mailto:${escapeHtml(email)}" style="color: #00e5ff;">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #94a3b8; vertical-align: top;">Message :</td>
            <td style="padding: 10px; white-space: pre-line;">${escapeHtml(message)}</td>
          </tr>
        </table>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "Message envoyé avec succès !" });
  } catch (err) {
    console.error("Erreur envoi email:", err);
    return res.status(500).json({ error: "Erreur lors de l'envoi. Réessayez plus tard." });
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
