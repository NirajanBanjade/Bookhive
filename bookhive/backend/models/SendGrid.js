const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const nodemailer = require("nodemailer");

function must(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

// create one reusable transporter
const GMAIL_USER = must("GMAIL_USER");
const GMAIL_APP_PASSWORD = must("GMAIL_APP_PASSWORD");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
});

async function sendMail({ to, subject, text, html, replyTo }) {
  // if (process.env.NODE_ENV === "test") {
  //   console.log("[mail] sendMail skipped in test env");
  //   return {
  //     skipped: true,
  //     to,
  //     subject,
  //   };
  // }

  const info = await transporter.sendMail({
    from: `"Bookhive" <${GMAIL_USER}>`,
    to,
    subject,
    text,
    html,
    ...(replyTo ? { replyTo } : {}),
  });

  return {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response,
  };
}

module.exports = { sendMail };
