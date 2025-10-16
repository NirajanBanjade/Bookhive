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



module.exports = { groupMemberJoin};