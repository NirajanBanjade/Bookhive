const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new mongoose.Schema({
  userId:   { type: String, required: true },
  message:  { type: String, required: true },
  type:     { type: String, enum: ['info','success','warning'], default: 'info' },
  createdAt:{ type: Date, default: Date.now },
  read:     { type: Boolean, default: false },

  actorId:    { type: String },                       // who triggered it
  eventType:  {                                       
    type: String,
    enum: ['TO_READ_ADDED', 'COMMENT', 'REPLY', 'MENTION'],
  },
  entityType: { type: String },                       // e.g., "BOOK", "COMMENT"
  entityId:   { type: String },                       // e.g., GoogleBookId or CommentId
  metadata:   { type: Schema.Types.Mixed, default: {} },
  readAt:     { type: Date },                         // when it was read
});

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

notificationSchema.methods.markRead = function () {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);
