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
    // store ONLY a hash
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: [String],
      enum: ["User", "Admin"],
      default: ["User"],
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    // === PROFILE FIELDS ADDED FOR USER PROFILE FEATURE === //
    // Display name (can be different from username)
    name: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    // User biography/description for profile page
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    // URL/path to user's profile picture
    profileImageUrl: {
      type: String,
      default: null,
    },
    // Reading statistics for profile display
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
  const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);
  this.passwordHash = await bcrypt.hash(plain, rounds);
};

// Verify user password during login
User.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// email verified at: function still is not made. need to figure out to send tokens during registration.

module.exports = mongoose.model("User", User);
