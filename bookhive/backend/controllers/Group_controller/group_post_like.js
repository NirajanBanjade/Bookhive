const BookGroup = require('../../models/Group');
const Membership = require('../../models/Group_schemas/Membership');
const Post = require('../../models/Group_schemas/Member_post');
const mongoose = require('mongoose');

const toKey = raw => (BookGroup.toKey ? BookGroup.toKey(raw) : raw.toLowerCase().trim());

// POST /groups/:category/posts/:postId/like
const likeGroupPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const categoryKey = toKey(req.params.category);
    const { postId } = req.params;
    const { isLiked } = req.body; // true to like, false to unlike

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid postId' });
    }

    const group = await BookGroup.findOne({ categoryKey });
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // Verify membership
    const isMember = await Membership.exists({ groupId: group._id, userId });
    if (!isMember) return res.status(403).json({ message: 'Only group members can like posts' });

    // Verify post exists in this group
    const post = await Post.findOne({ _id: postId, groupId: group._id });
    if (!post) return res.status(404).json({ message: 'Post not found in this group' });

    if (isLiked) {
      // Add like - use $addToSet to prevent duplicates
      await Post.findByIdAndUpdate(postId, {
        $addToSet: { likedBy: userId },
        $inc: { likesCount: 1 }
      });
    } else {
      // Remove like
      await Post.findByIdAndUpdate(postId, {
        $pull: { likedBy: userId },
        $inc: { likesCount: -1 }
      });
    }

    return res.status(200).json({ success: true, isLiked });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { likeGroupPost };