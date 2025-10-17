const mongoose = require('mongoose');
const BookGroup = require('../../models/Group');
const Membership = require('../../models/Group_schemas/Membership');
const Post = require('../../models/Post');

const toKey = raw => (BookGroup.toKey ? BookGroup.toKey(raw) : raw.toLowerCase().trim());
const createGroupPost = async (req, res) => {
  try {
    const userId = req.user.id;    
    const categoryKey = toKey(req.params.category);
    const { content, linkUrl } = req.body || {};

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'content required' });
    }

    // findin group
    const group = await BookGroup.findOne({ categoryKey }).lean();
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // only members can post
    const me = await Membership.findOne({ groupId: group._id, userId }).lean();
    if (!me) return res.status(403).json({ message: 'Only group members can post' });

    // create post
    const post = await Post.create({
      groupId: group._id,
      userId,
      content: content.trim(),
      linkUrl: linkUrl?.trim() || undefined,
    });

    return res.status(201).json({
      created: true,
      post,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports= { createGroupPost };