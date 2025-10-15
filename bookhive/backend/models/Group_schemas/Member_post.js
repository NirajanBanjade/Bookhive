const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  groupId:   { type: mongoose.Schema.Types.ObjectId, ref: 'BookGroup', required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:      { type: String, enum: ['text','image','link'], default: 'text' },
  content:   { type: String, trim: true, required: true },         // text body OR caption
  mediaUrl:  { type: String },                                     // if image
  linkUrl:   { type: String },                                     // if link
  // lightweight counters (optional, but useful)
  commentsCount: { type: Number, default: 0, min: 0 },
  likesCount:    { type: Number, default: 0, min: 0 },
}, { timestamps: true });

PostSchema.index({ groupId: 1, createdAt: -1 });                   // fast feed per group

module.exports = mongoose.model('Post', PostSchema);
