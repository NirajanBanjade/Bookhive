const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  postId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  content: { type: String, trim: true, required: true, maxlength: 2000 },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

CommentSchema.index({ postId: 1, createdAt: 1 }); 

module.exports = mongoose.model('Reply', ReplySchema);
