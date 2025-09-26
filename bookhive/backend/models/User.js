const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const emailValidator = (email)=>{
  if (typeof email !== 'string') return false;
  if(/\s/.test(email)) return false;
  if((email.length<6)||(email.length>50)) return false;
  const basicShape = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; 
  return basicShape.test(email);
}

const passwordValidator = (password) => {
  if (typeof password !== 'string') return false;
  if (/\s/.test(password)) return false;
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[^\s]{8,64}$/; 
  return re.test(password);
};

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
        validate: {
          validator: emailValidator,
          message: 'Email is not valid',
        },
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
    if (!passwordValidator(plain)) {
      throw new Error(
        `Password doesn't match the criteria.`
      );
    }
    return bcrypt.compare(plain, this.passwordHash);
};

// email verified at: function still is not made. need to figure out to send tokens during registration.
  
module.exports = mongoose.model('User', User);