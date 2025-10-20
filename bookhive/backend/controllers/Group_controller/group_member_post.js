const BookGroup = require('../../models/Group');
const Membership = require('../../models/Group_schemas/Membership');
const Post = require('../../models/Group_schemas/Member_post');
const mongoose = require('mongoose');

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

const deleteGroupPost=async (req,res)=>{
    try{
        const userId=req.user.id;
        const categoryKey = toKey(req.params.category);
        const { postId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid postId' });
          }

        const group = await BookGroup.findOne({ categoryKey });
        if (!group) return res.status(404).json({ message: 'Group not found' }); // if no group, then return..

        const post = await Post.findById(postId);
        if (!post || String(post.groupId) !== String(group._id)) {
          return res.status(404).json({ message: 'Post not found in this group' });
        }


        const del = await Post.findOneAndDelete({
            _id: postId,
            groupId: group._id,
            userId, // post owner can delete it , others cant.
          });
      
        if (!del) {
            // Either not found, not in this group, or not owned by user
            return res.status(403).json({ message: 'Forbidden: Only the author can delete this post' });
        }
      
        return res.status(200).json({ deleted: true, postId: del._id });
    }
    catch(err){
        return res.status(500).json({ message: err.message });
    }
}

module.exports= { createGroupPost, deleteGroupPost };