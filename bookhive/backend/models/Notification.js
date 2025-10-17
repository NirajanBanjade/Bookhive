const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const notificationSchema = new Schema({
  userId: {
    type: Types.ObjectId, // allows referencing actual user documents later
    required: true,
    ref: "User",
  },
  message: { type: String, required: true },
  type: { type: String, enum: ["info", "success", "warning"], default: "info" },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },

  actorId: { type: Types.ObjectId, ref: "User" }, // who triggered it
  eventType: {
    type: String,
    enum: ["TO_READ_ADDED", "COMMENT", "REPLY", "MENTION"],
  },
  entityType: { type: String }, // e.g., "BOOK", "COMMENT"
  entityId: { type: String }, // e.g., GoogleBookId or CommentId
  metadata: { type: Schema.Types.Mixed, default: {} },
  readAt: { type: Date }, // when it was read
});

// Performance index for filtering/sorting
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

// Instance method to mark as read
notificationSchema.methods.markRead = function () {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

module.exports = mongoose.model("Notification", notificationSchema);
