const mongoose = require('mongoose');


function toKey(s) { // normalization of category names.....
    return s?.toString()
      .normalize('NFKD')               // split accents
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .trim()
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')     // collapse to hyphens
      .replace(/(^-|-$)/g, '');        // trim hyphens
  }

const BookGroupSchema = new mongoose.Schema(
    {
        categoryKey: { type: String, required: true, trim: true, set:toKey, unique: true, index: true},
        name: { type: String, required: true },
        membersCount: { type: Number, default: 0, min: 0 },
        createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    },
    { timestamps: true }
);

BookGroupSchema.index({ categoryKey: 1 }, { unique: true });

module.exports = mongoose.model('BookGroup', BookGroupSchema);