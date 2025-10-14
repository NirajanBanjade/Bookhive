const mongoose = require("mongoose");

const WeightedTermSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  weight: { type: Number, required: true, min: 0 },
}, { _id: false });

const UserInterestProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  authors: [WeightedTermSchema],
  categories: [WeightedTermSchema],
  keywords: [WeightedTermSchema],
  sourceCounts: {
    toRead: { type: Number, default: 0 },
    currentlyReading: { type: Number, default: 0 },
    finished: { type: Number, default: 0 },
  },
  lastBuiltAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("UserInterestProfile", UserInterestProfileSchema);
