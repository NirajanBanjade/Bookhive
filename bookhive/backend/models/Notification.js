// models/Notification.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  // Recipient of the notification (now stored as a string)
  userId: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  // UI severity/type (non-functional)
  type: {
    type: String,
    enum: ['info', 'success', 'warning'],
    default: 'info',
  },

  // When it was created (kept explicit to match existing behavior)
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Read state & timestamp
  read: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },

  //  Actor who triggered the event (also string for consistency)
  actorId: {
    type: String,
  },

  // What happened
  eventType: {
    type: String,
    enum: ['TO_READ_ADDED', 'COMMENT', 'REPLY', 'MENTION'],
  },

  entityType: {
    type: String,
  },
  entityId: {
    type: String,
  },

  // Extra context for rendering or linking
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

// Query performance for list views
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

// Instance method: mark as read
notificationSchema.methods.markRead = function () {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);
