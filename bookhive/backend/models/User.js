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
  
module.exports = mongoose.model('User', User);