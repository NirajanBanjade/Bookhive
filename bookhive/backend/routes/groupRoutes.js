const express = require('express');
const { groupMemberJoin, groupMemberLeave } = require('../controllers/Group_controller/group_member_join'); 
const authenticateToken = require('../middleware/jwt_auth');

const router = express.Router();

// Join a group (lazy-creates group if needed)
router.post('/groups/:category/join', authenticateToken, groupMemberJoin);

// Leave a group
router.delete('/groups/:category/leave', authenticateToken, groupMemberLeave);






//---------------------Post replies-------------------------------------
const { createPostReply, getPostReplies, deletePostReply } = require('../controllers/Group_controller/Reply_controller/group_reply_controller');
router.post('/groups/:category/posts/:postId/replies', authenticateToken, createPostReply);
router.get('/groups/:category/posts/:postId/replies', authenticateToken, getPostReplies);
router.delete('/groups/:category/posts/:postId/replies/:replyId', authenticateToken, deletePostReply);

 // this section is strictly for the group posts. Post handlers will be in same routes.-------------------



const { createGroupPost, deleteGroupPost, editGroupPost } = require('../controllers/Group_controller/group_member_post');

router.post('/groups/:category/posts', authenticateToken, createGroupPost);
router.delete('/groups/:category/posts/:postId', authenticateToken, deleteGroupPost);
router.put('/groups/:category/posts/:postId', authenticateToken, editGroupPost);





// -----------------------------------------------------------------
//this is for displaying all posts of a specific group.



const { listGroupPosts } = require('../controllers/Group_controller/group_posts_all');
router.get('/groups/:category/posts',  authenticateToken, listGroupPosts);

//--------------------------------------------------------------------
const { listMyGroups } = require('../controllers/Group_controller/group_list_member');
router.get('/me/groups', authenticateToken, listMyGroups);




module.exports = router;
