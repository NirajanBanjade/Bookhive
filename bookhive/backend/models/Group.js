const mongoose = require('mongoose');

const BookGroupSchema = new mongoose.Schema(
    {
        bookId: { type: String, required: true },
        slug: { type: String, required: true }, // for URL slugs.
        name: { type: String, required: true },
        membersCount: { type: Number, default: 0, min: 0 },
    },
    { timestamps: true }
);