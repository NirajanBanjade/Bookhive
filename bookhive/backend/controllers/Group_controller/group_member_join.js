const BookGroup = require('../../models/Group');
const Membership = require('../../models/Group_schemas/Membership');

const groupMemberJoin = async (req, res) => {
    try {
        const userId = req.user.id;
        const raw = req.params.category;
        const categoryKey = BookGroup.toKey ? BookGroup.toKey(raw) : raw.toLowerCase().trim();
        const name = req.body?.name || raw;

        // lazy create group
        let group = await BookGroup.findOne({ categoryKey });
        if (!group) group = await BookGroup.create({ categoryKey, name, createdBy: userId });

        // idempotent membership
        const existing = await Membership.findOne({ groupId: group._id, userId });
        if (!existing) {
            await Membership.create({ groupId: group._id, userId, role: 'member' });
            // SIMPLE COUNT INCREMENT
            await BookGroup.updateOne({ _id: group._id }, { $inc: { membersCount: 1 } });
        }

        return res.status(200).json({ joined: true, alreadyMember: !!existing, groupId: group._id });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const groupMemberLeave = async (req, res) => {
    try {
        const userId = req.user.id;
        const categoryKey = BookGroup.toKey ? BookGroup.toKey(req.params.category) : req.params.category.toLowerCase().trim();

        const group = await BookGroup.findOne({ categoryKey });
        if (!group) return res.status(200).json({ left: true, existed: false });

        const deleted = await Membership.findOneAndDelete({ groupId: group._id, userId });
        if (deleted) {
            // SIMPLE COUNT DECREMENT (guard floor at 0 if you like)
            await BookGroup.updateOne(
                { _id: group._id, membersCount: { $gt: 0 } },
                { $inc: { membersCount: -1 } }
            );
        }

        return res.status(200).json({ left: true, existed: !!deleted });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { groupMemberJoin, groupMemberLeave };