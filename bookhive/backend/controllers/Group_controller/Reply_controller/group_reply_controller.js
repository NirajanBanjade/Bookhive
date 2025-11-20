const BookGroup = require('../../../models/Group');
const Membership = require('../../../models/Group_schemas/Membership');
const Post = require('../../../models/Group_schemas/Member_post');
const Reply = require('../../../models/Group_schemas/Reply_post');

const mongoose = require('mongoose');
const {
  createReply,
  findRepliesByPost,
  deleteReply,
  incrementReplyCount,
  decrementReplyCount
} = require('../Group_services/replyService');

const toKey = raw => (BookGroup.toKey ? BookGroup.toKey(raw) : raw.toLowerCase().trim());

const createPostReply = async (req, res) => {
  try {
    const userId = req.user.id;
    const categoryKey = toKey(req.params.category);
    const { postId } = req.params;
    const { content } = req.body || {};

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'content required' });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid postId' });
    }

    const group = await BookGroup.findOne({ categoryKey }).lean();
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const membership = await Membership.findOne({ groupId: group._id, userId }).lean();
    if (!membership) {
      return res.status(403).json({ message: 'Only group members can reply' });
    }

    const post = await Post.findOne({ _id: postId, groupId: group._id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found in this group' });
    }

    const reply = await createReply(postId, userId, content);
    await incrementReplyCount(postId);

    const populatedReply = await Reply.findById(reply._id)
      .populate('userId', 'name username email');

    return res.status(201).json({
      created: true,
      reply: populatedReply
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getPostReplies = async (req, res) => {
  try {
    const categoryKey = toKey(req.params.category);
    const { postId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid postId' });
    }

    const group = await BookGroup.findOne({ categoryKey }).lean();
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const post = await Post.findOne({ _id: postId, groupId: group._id }).lean();
    if (!post) {
      return res.status(404).json({ message: 'Post not found in this group' });
    }

    const replies = await findRepliesByPost(postId, { limit, skip });

    return res.status(200).json({
      replies,
      count: replies.length
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deletePostReply = async (req, res) => {
  try {
    const userId = req.user.id;
    const categoryKey = toKey(req.params.category);
    const { postId, replyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(replyId)) {
      return res.status(400).json({ message: 'Invalid postId or replyId' });
    }

    const group = await BookGroup.findOne({ categoryKey }).lean();
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const post = await Post.findOne({ _id: postId, groupId: group._id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found in this group' });
    }

    const deleted = await deleteReply(replyId, userId);
    if (!deleted) {
      return res.status(403).json({ message: 'Forbidden: Only the author can delete this reply' });
    }

    await decrementReplyCount(postId);

    return res.status(200).json({ deleted: true, replyId: deleted._id });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPostReply,
  getPostReplies,
  deletePostReply
};