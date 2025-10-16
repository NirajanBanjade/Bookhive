const mongoose = require('mongoose');

const BookGroupSchema = new mongoose.Schema(
    {
        categorykey: { type: String, required: true },
        slug: { type: String, required: true }, // for URL slugs.
        name: { type: String, required: true },
        membersCount: { type: Number, default: 0, min: 0 },
        createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    },
    { timestamps: true }
);

BookGroupSchema.index({ bookId: 1 }, { unique: true });
BookGroupSchema.index({ slug: 1 },   { unique: true });

module.exports = mongoose.model('BookGroup', BookGroupSchema);