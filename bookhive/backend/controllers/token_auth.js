const User = require('../models/User');
const { issueResetCode } = require('../util/token_util.js');

const sendMail = require('../models/SendGrid.js');
async function requestPasswordReset(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).json({ ok: true });
        }

        const code = await issueResetCode(user);
        //   console.log(code);
        await sendMail({
            to: user.email,
            subject: 'Your password reset code',
            text: `Your code is ${code}. It expires in 10 minutes.`,
        });
        return res.json({ ok: true });
    } catch {
        return res.status(500).json({ error: 'Internal server error!' });
    }
}

async function resetPasswordAfterCode(req, res) {
    try {

        const { email, code, newPassword } = req.body;
        if (typeof email !== 'string' || typeof code !== 'string' || typeof newPassword !== 'string') {
            return res.status(400).json({ error: 'Invalid input types' });
        }

        const user = await User.findOne({ email }).select('+passwordHash +resetOtpPlain +resetOtpExpiresAt');
        if (!user || user.resetOtpPlain !== code || user.resetOtpExpiresAt < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired code!' });
        }

        await user.setPassword(newPassword); // its caling setpassword method in user model.
        user.resetOtpPlain = undefined;
        user.resetOtpExpiresAt = undefined;
        await user.save();

        return res.json({ ok: true });

    }
    catch {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { requestPasswordReset, resetPasswordAfterCode };
