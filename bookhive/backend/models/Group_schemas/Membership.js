const mongoose = require('mongoose');

const MembershipSchema = new mongoose.Schema({
  groupId:    { type: mongoose.Schema.Types.ObjectId, ref: 'BookGroup', required: true },
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role:       { type: String, enum: ['member','owner'], default: 'member' },
  joinedAt:   { type: Date, default: Date.now },
  lastReadAt: { type: Date },
}, { timestamps: true });

// One membership per user per group
MembershipSchema.index({ groupId: 1, userId: 1 }, { unique: true });

// Enforce a single owner per group
MembershipSchema.index(
  { groupId: 1, role: 1 },
  { unique: true, partialFilterExpression: { role: 'owner' } }
);

module.exports = mongoose.model('Membership', MembershipSchema);
