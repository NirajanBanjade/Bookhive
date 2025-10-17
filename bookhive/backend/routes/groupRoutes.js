const express = require('express');
const { groupMemberJoin, groupMemberLeave } = require('../controllers/Group_controller/group_member_join'); 
const authenticateToken = require('../middleware/jwt_auth');

const router = express.Router();

// Join a group (lazy-creates group if needed)
router.post('/groups/:category/join', authenticateToken, groupMemberJoin);

// Leave a group
router.delete('/groups/:category/leave', authenticateToken, groupMemberLeave);

module.exports = router;
