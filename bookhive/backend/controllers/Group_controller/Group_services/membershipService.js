const Membership = require('../../../models/Group_schemas/Membership');


async function findMembership(groupId, userId) {
    return Membership.findOne({ groupId, userId });
}

async function createMembership(groupId, userId, role = 'member') {
    return Membership.create({ groupId, userId, role });
}

async function deleteMembership(groupId, userId) {
    return Membership.findOneAndDelete({ groupId, userId });
}

module.exports = {
    findMembership,
    createMembership,
    deleteMembership
};
