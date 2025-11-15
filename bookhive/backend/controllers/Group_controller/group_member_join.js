// controllers/groupMemberController.js
const {
    getOrCreateGroup,
    incrementMemberCount,
    decrementMemberCount
} = require('./Group_services/groupService');

const {
    findMembership,
    createMembership,
    deleteMembership
} = require('./Group_services/membershipService');

const BookGroup = require('../../models/Group');

const groupMemberJoin = async (req, res) => {
    try {
        const userId = req.user.id;
        const raw = req.params.category;
        const categoryKey = BookGroup.toKey ? BookGroup.toKey(raw) : raw.toLowerCase().trim();
        const name = req.body?.name || raw;

        const group = await getOrCreateGroup(categoryKey, name, userId);

        const existing = await findMembership(group._id, userId);
        if (!existing) {
            await createMembership(group._id, userId, 'member');
            await incrementMemberCount(group._id);
        }

        return res.status(200).json({
            joined: true,
            alreadyMember: !!existing,
            groupId: group._id
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const groupMemberLeave = async (req, res) => {
    try {
        const userId = req.user.id;
        const raw = req.params.category;
        const categoryKey = BookGroup.toKey ? BookGroup.toKey(raw) : raw.toLowerCase().trim();

        const group = await BookGroup.findOne({ categoryKey });
        if (!group) {
            return res.status(200).json({ left: true, existed: false });
        }

        const deleted = await deleteMembership(group._id, userId);
        if (deleted) await decrementMemberCount(group._id);

        return res.status(200).json({
            left: true,
            existed: !!deleted
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    groupMemberJoin,
    groupMemberLeave
};
