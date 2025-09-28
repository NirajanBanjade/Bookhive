
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const nodemailer = require("nodemailer");

function must(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function notifyAdmin() {
  const user = must("GMAIL_USER");
  const appPass = must("GMAIL_APP_PASSWORD");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: { user, pass: appPass },
  });

  const info = await transporter.sendMail({
    from: `"Bookhive" <${user}>`,       // must be the same Gmail account
    to: "nirajanbanjade321@gmail.com",  // test recipient
    subject: "New User Registered",
    text: "A new user has registered on Bookhive.",
    html: "<b>Greeting!</b><br>A new user has registered on Bookhive.",
  });

  console.log("Message sent:", info.messageId, "accepted:", info.accepted, "rejected:", info.rejected);
}

notifyAdmin().catch((err) => {
  console.error("Send failed:", err);
  process.exit(1);
});

