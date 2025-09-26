const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const emailValidator = (email)=>{
  if (typeof email !== 'string') return false;
  if(/\s/.test(email)) return false;
  if((email.length<6)||(email.length>50)) return false;
  const basicShape = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return basicShape.test(email);
}


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
    },

    { timestamps: true }
  );

User.methods.setPassword = async function (plain) {

    const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
    this.passwordHash = await bcrypt.hash(plain, rounds);
};
User.methods.verifyPassword = function (plain) {
    return bcrypt.compare(plain, this.passwordHash);
};

// email verified at: function still is not made. need to figure out to send tokens during registration.


function email_validator(email, password) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return emailRegex.test(email) && passwordRegex.test(password);
}
  
module.exports = mongoose.model('User', User);