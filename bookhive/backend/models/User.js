const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
      // Date of Birth for age verification
      dateOfBirth: {
        type: Date,
        required: false,  // Changed to false to support existing users
      },
      // Calculated field to track if user is under 18
      isMinor: {
        type: Boolean,
        default: false,
      },
      // store ONLY a hash
      passwordHash: { type: String, 
        required: true, 
        select: false },
        role: {
            type:[String],
            enum:['User','Admin'],
            default: ['User']
        },
        emailVerifiedAt: { type: Date, default: null }, 
        resetOtpPlain: { type: String, select: false },
        resetOtpExpiresAt: { type: Date, select: false },
        passwordHistory:    [{ type: String, select: false }],
    // === PROFILE FIELDS ADDED FOR USER PROFILE FEATURE === //
    name: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    location: {
      type: String,
      maxlength: 100,
      default: "",
    },
    profileImageUrl: {
      type: String,
      default: null,
    },
    booksRead: {
      type: Number,
      default: 0,
    },
    currentlyReading: {
      type: Number,
      default: 0,
    },
    wantToRead: {
      type: Number,
      default: 0,
    },
    // === END PROFILE FIELDS === //
  },

  { timestamps: true }
);

// Hash password before saving to database
User.methods.setPassword = async function (plain) {

    const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
    const passwordHash=await bcrypt.hash(plain, rounds);
    this.passwordHistory = this.passwordHistory || [];

    if (this.passwordHash) {
      const sameAsCurrent = await bcrypt.compare(plain, this.passwordHash);
      if (sameAsCurrent) {
        throw new Error('New password must be different from the current password!');
      }
    }
    
    for(let pass in this.passwordHistory){
        const match= await bcrypt.compare(plain, this.passwordHistory[pass]);
        if(match) throw new Error('New password must be different from last three passwords!');
    }
    if (this.passwordHash) {
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

// Calculate if user is a minor (under 18 years old)
User.methods.calculateIsMinor = function () {
  if (!this.dateOfBirth) return false;
  
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // Adjust age if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age < 18;
};

module.exports = mongoose.model("User", User);