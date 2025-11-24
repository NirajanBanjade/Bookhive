const BookGroup = require('../../models/Group');
const Membership = require('../../models/Group_schemas/Membership');
const Post = require('../../models/Group_schemas/Member_post');

const toKey = raw => (BookGroup.toKey ? BookGroup.toKey(raw) : raw.toLowerCase().trim());

// GET /groups/:category/posts
const listGroupPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const categoryKey = toKey(req.params.category);
    
    const group = await BookGroup.findOne({ categoryKey }).lean();
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    const isMember = await Membership.exists({ groupId: group._id, userId });
    if (!isMember) return res.status(403).json({ message: 'Only group members can view posts' });
    
    const posts = await Post.find({ groupId: group._id })
      .sort({ createdAt: -1 })
      .populate('userId', '_id name username')
      .lean();
    
    // Add isLikedByUser flag based on likedBy array
    const postsWithLikeStatus = posts.map(post => ({
      ...post,
      isLikedByUser: post.likedBy?.some(id => id.toString() === userId.toString()) || false
    }));
    
    res.status(200).json({ groupId: group._id, categoryKey, posts: postsWithLikeStatus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { listGroupPosts };