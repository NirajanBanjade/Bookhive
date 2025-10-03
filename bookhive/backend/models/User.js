const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 6,
        maxlength: 25,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      // store ONLY a hash
      passwordHash: { type: String, 
        required: true, 
        select: false },
        role: {
            type:[String],
            enum:['User','Admin'],  // Guest users are not authentic users. so haven't made any roles for them.
            default: ['User']
        },
        emailVerifiedAt: { type: Date, default: null }, 
        resetOtpPlain: { type: String, select: false },
        resetOtpExpiresAt: { type: Date, select: false },
        passwordHistory:    [{ type: String, select: false }],

    },

    { timestamps: true }
  );

User.methods.setPassword = async function (plain) {

    const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
    // this.passwordHash = await bcrypt.hash(plain, rounds);
    const passwordHash=await bcrypt.hash(plain, rounds);
    this.passwordHistory = this.passwordHistory || [];

    if (sameAsCurrent) {
      const e = new Error('New password must be different from the current password!');
      e.statusCode = 400;                     
      e.code = 'PASSWORD_SAME_AS_CURRENT';    
      throw e;
    }
    
    for(let pass in this.passwordHistory){
        const match= await bcrypt.compare(plain, this.passwordHistory[pass]);
        if(match) throw new Error('New password must be different from last three passwords!');
    }
    if (this.passwordHash) { // this if exist for update if not exist then during register wont be executed.
      this.passwordHistory.unshift(this.passwordHash);
      if (this.passwordHistory.length > 3) {
        this.passwordHistory = this.passwordHistory.slice(0, 3);
      }
    }
    this.passwordHash=passwordHash;

};
User.methods.verifyPassword = function (plain) {
    return bcrypt.compare(plain, this.passwordHash);
};

// email verified at: function still is not made. need to figure out to send tokens during registration.
  
module.exports = mongoose.model('User', User);