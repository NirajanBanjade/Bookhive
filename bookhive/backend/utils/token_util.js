const crypto = require('crypto');

async function issueResetCode(userDoc) { 
  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
  userDoc.resetOtpPlain = code;
  userDoc.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
//   userDoc.resetOtpExpiresAt = new Date(Date.now());
  await userDoc.save();
  return code;
}
module.exports = { issueResetCode };
