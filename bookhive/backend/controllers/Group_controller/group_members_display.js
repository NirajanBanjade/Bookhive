// controllers/groupMemberNames.js
const BookGroup = require('../../models/Group');
const Membership = require('../../models/Group_schemas/Membership');

const toKey = raw => (BookGroup.toKey ? BookGroup.toKey(raw) : raw.toLowerCase().trim());

// GET /groups/:category/member-names
const groupMemberDetails = async (req, res) => {
  try {
    const userId = req.user.id; // requires auth middleware
    const categoryKey = toKey(req.params.category);

    const group = await BookGroup.findOne({ categoryKey }).lean();
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // (Optional) Gate: only members can see the list
    const me = await Membership.findOne({ groupId: group._id, userId }).lean();
    if (!me) return res.status(403).json({ message: 'Only group members can view members' });

    // fetch all memberships and populate user basic identity
    const memberships = await Membership.find({ groupId: group._id })
      .populate('userId', '_id name username')   // we can change this to fetch more . for testing just name, username..
      .lean();

    // map to display name, with sensible fallback if name is missing
    const members = memberships.map(m => ({
      id: m.userId?._id,
      name: m.userId?.name || m.userId?.username || 'Unknown',
      role: m.role
    }));
    // const names = members.map(m => m.name);// will just display names include in the rerturn below..

    return res.status(200).json({
      groupId: group._id,
      categoryKey,
      count: members.length,
      members,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { groupMemberDetails };
