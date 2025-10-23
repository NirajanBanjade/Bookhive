const mongoose = require('mongoose');
const BookGroup = require('../../models/Group');
const Membership = require('../../models/Group_schemas/Membership');

const listMyGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
    const cursor = req.query.cursor || null; // cursor = Membership._id for keyset pagination

    const find = { userId };
    if (cursor && mongoose.isValidObjectId(cursor)) {
      find._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    const memberships = await Membership.find(find)
      .sort({ _id: -1 })
      .limit(limit)
      .populate({
        path: 'groupId',
        select: 'name categoryKey membersCount createdAt createdBy',
        options: { lean: true },
      })
      .lean();

    // Filter out any dangling refs just in case
    const items = memberships
      .filter(m => m.groupId)
      .map(m => ({
        groupId: m.groupId._id,
        name: m.groupId.name,
        categoryKey: m.groupId.categoryKey,
        membersCount: m.groupId.membersCount ?? 0,
        role: m.role,
        joinedAt: m.createdAt,
        createdBy: m.groupId.createdBy,
      }));

    const nextCursor = memberships.length ? memberships[memberships.length - 1]._id : null;

    return res.status(200).json({
      items,
      nextCursor,         // pass this back as ?cursor=... for the next page
      pageSize: items.length,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { listMyGroups };
