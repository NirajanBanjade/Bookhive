const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid');
require('dotenv').config();


// 6-digit crypto-secure token
function generateNumericToken() {
  // 100000–999999
  return String(crypto.randomInt(100000, 1000000));
}

const transport = nodemailer.createTransport(
  sendgrid({ apiKey: process.env.SENDGRID_API_KEY })
);

async function sendEmail({ to }) {
  const token = generateNumericToken();

  try {
    const info = await transport.sendMail({
      from: process.env.EMAIL_FROM,             // must be a verified sender
      to,                                       // e.g., user email
      subject: 'Your verification code',
      text: `Use this code to verify your email: ${token}`,
      html: `<h1>Your verification code</h1>
             <p>Use this code to verify your email: <b>${token}</b></p>`
    });
    return { token, messageId: info.messageId };
  } catch (err) {
    console.error('Email send failed:', err);
    throw err;
  }
}

// example
sendEmail({ to: 'nirajanbanjade123@gmail.com' }).then(console.log);
module.exports = { sendEmail, generateNumericToken };
