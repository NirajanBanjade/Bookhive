const { issueResetCode } = require('../utils/token_util.js');
const { sendMail } = require('../utils/mailEvents.js'); // ✅ Use mailEvents
const { getUserByEmail } = require('../services/getUserByEmail.js'); // ✅ Use service

async function requestPasswordReset(req, res) {
  try {
    const user = await getUserByEmail(req.body.email);
    
    if (!user) {
      // Return 200 to prevent email enumeration
      return res.status(200).json({ ok: true });
    }

    // Optional: Check if code was recently sent (uncomment if needed)
    // if (user.resetOtpExpiresAt && user.resetOtpExpiresAt > new Date()) {
    //   return res.status(429).json({ error: 'Code was recently sent. Please try again later.' });
    // }

    const code = await issueResetCode(user);
    
    // ✅ Clean email sending
    await sendMail.passwordReset(user, code);

    return res.json({ ok: true });
  } catch (err) {
    console.error('requestPasswordReset error:', err);
    return res.status(500).json({ error: 'Internal server error!' });
  }
}

async function resetPasswordAfterCode(req, res) {
  try {
    const { email, code, newPassword } = req.body;

    // Validate input types
    if (typeof email !== 'string' || typeof code !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({ error: 'Invalid input types' });
    }

    // ✅ Use service to get user with sensitive fields
    const user = await getUserByEmail(
      email, 
      '+passwordHash +passwordHistory +resetOtpPlain +resetOtpExpiresAt'
    );

    // Validate code and expiration
    if (!user || user.resetOtpPlain !== code || user.resetOtpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired code!' });
    }

    // Update password
    await user.setPassword(newPassword);
    
    // Invalidate reset token
    user.resetOtpPlain = undefined;
    user.resetOtpExpiresAt = undefined;
    await user.save();

    return res.status(200).json({
      ok: true,
      message: 'Password updated successfully. Please sign in again!',
    });
  } catch (err) {
    const msg = String(err?.message || '');
    
    // Handle password validation errors
    if (
      msg === 'New password must be different from the current password!' ||
      msg === 'New password must be different from last three passwords!'
    ) {
      return res.status(400).json({ error: msg });
    }

    console.error('resetPasswordAfterCode error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { requestPasswordReset, resetPasswordAfterCode };