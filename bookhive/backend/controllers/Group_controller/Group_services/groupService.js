const BookGroup = require('../../../models/Group');


async function getOrCreateGroup(categoryKey, name, createdBy) {
    let group = await BookGroup.findOne({ categoryKey });
    if (!group) {
        group = await BookGroup.create({ categoryKey, name, createdBy });
    }
    return group;
}

async function incrementMemberCount(groupId) {
    await BookGroup.updateOne(
        { _id: groupId },
        { $inc: { membersCount: 1 } }
    );
}

async function decrementMemberCount(groupId) {
    await BookGroup.updateOne(
        { _id: groupId, membersCount: { $gt: 0 } },
        { $inc: { membersCount: -1 } }
    );
}

module.exports = {
    getOrCreateGroup,
    incrementMemberCount,
    decrementMemberCount
};
