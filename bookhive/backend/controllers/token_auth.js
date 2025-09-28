const User = require('../models/User');
const { issueResetCode } = require('../util/token_util.js');

async function requestPasswordReset(req, res) {
  const user = await User.findOne({ email: req.body.email }); 
  if (!user){
     return res.status(200).json({ ok: true });
  }      

  const code = await issueResetCode(user); 
  console.log(code);
  return res.json({ ok: true });
}
