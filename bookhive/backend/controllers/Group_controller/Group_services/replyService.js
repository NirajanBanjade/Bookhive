const Reply = require('../../../models/Group_schemas/Reply_post');
const { find } = require('../../../models/User');
const Post = require('../../../models/Group_schemas/Member_post'); 
const createReply = async (postId, userId, content) => {
  return await Reply.create({
    postId,
    userId,
    content: content.trim()
  });
}


const findRepliesByPost = async (postId, options = {}) => {
    const { limit = 50, skip = 0, sortOrder = 1 } = options;
    return await Reply.find({ postId, isDeleted: false })
      .populate('userId', 'name username email')
      .sort({ createdAt: sortOrder })
      .limit(limit)
      .skip(skip)
      .lean();
  };
  
  const deleteReply = async (replyId, userId) => {
    return await Reply.findOneAndUpdate(
      { _id: replyId, userId },
      { isDeleted: true },
      { new: true }
    );
  };

  const incrementReplyCount = async (postId) => {
    return await Post.findByIdAndUpdate(
      postId,
      { $inc: { commentsCount: 1 } }
    );
  };
  
  const decrementReplyCount = async (postId) => {
    return await Post.findByIdAndUpdate(
      postId,
      { $inc: { commentsCount: -1 } }
    );
  };
  
module.exports = {
    createReply,
    findRepliesByPost,
    deleteReply,
    incrementReplyCount,
    decrementReplyCount
}