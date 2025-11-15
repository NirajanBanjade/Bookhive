const { sendMail } = require('../models/SendGrid.js');

// Password reset email
sendMail.passwordReset = async (user, code) => {
  return sendMail({
    to: user.email,
    subject: "Your password reset code",
    text: `Your code is ${code}. It expires in 10 minutes.`,
    html: `
      <h2>Password Reset Request</h2>
      <p>Your reset code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
};

// Welcome email (for register)
sendMail.welcome = async (user) => {
  return sendMail({
    to: user.email,
    subject: "Welcome to BookHive!",
    text: `Hello ${user.username}, welcome to BookHive!`,
    html: `
      <h1>Welcome to BookHive, ${user.username}! 📚</h1>
      <p>We're excited to have you join our reading community.</p>
      <p>Start exploring books and connect with fellow readers!</p>
    `,
  });
};

// Login notification
sendMail.loginAlert = async (user, loginDetails = {}) => {
  const { ip, userAgent, timestamp } = loginDetails;
  return sendMail({
    to: user.email,
    subject: "New Login Detected",
    text: `Someone logged into your BookHive account.`,
    html: `
      <h2>New Login Detected</h2>
      <p>Hello ${user.username},</p>
      <p>A new login was detected on your account.</p>
      ${timestamp ? `<p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>` : ''}
      <p>If this wasn't you, please reset your password immediately.</p>
    `,
  });
};

module.exports = { sendMail };