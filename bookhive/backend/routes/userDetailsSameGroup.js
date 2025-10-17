const express = require('express');
const { auth } = require('../middleware/jwt_auth');
const { groupMemberDetails } = require('../controllers/Group_controller/group_members_display');

const router = express.Router();
// require auth to access so protected.
router.get('/groups/:category/member-names', auth, groupMemberDetails);

module.exports = router;
