// scripts/seedToRead.js
require('dotenv').config();
const mongoose = require('mongoose');
const ToRead = require('../models/ToRead');
const { searchVolumes, mapToToReadBook } = require('../services/googleBooks');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
     dbName: process.env.MONGO_DB_NAME || 'Bookhive',
  });

    const userId = 'demo-user-123';

     //  Queries to seed
    const queries = ['clean code', 'javascript', 'node.js', 'software engineering'];

    // Collect results from Google Books
    const collected = [];
    for (const q of queries) {
      const data = await searchVolumes(q, { maxResults: 5 });
      for (const v of (data.items || [])) {
        collected.push(mapToToReadBook(v));
      }
    }

    // Deduplicate by googleBookId
    const unique = Object.values(
      collected.reduce((acc, b) => {
        if (b.googleBookId) acc[b.googleBookId] = acc[b.googleBookId] || b;
        return acc;
      }, {})
    );

    // Replace user’s to-read list
    await ToRead.deleteMany({ userId });
    await ToRead.create({ userId, books: unique });

    console.log(`Seeded ${unique.length} books for user ${userId} into DB: ${mongoose.connection.name}`);
    process.exit(0);
  } catch (e) {
    console.error('Seeding failed:', e.message);
    process.exit(1);
  }
})();
