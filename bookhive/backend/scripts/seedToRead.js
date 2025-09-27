// scripts/seedToRead.js
require('dotenv').config();
const mongoose = require('mongoose');
const ToRead = require('../models/ToRead');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
     dbName: process.env.MONGO_DB_NAME || 'Bookhive',
  });

    const userId = 'demo-user-123';

    await ToRead.deleteMany({ userId });
    await ToRead.create({
      userId,
      books: [
        { googleBookId: 'g1', title: 'Clean Code', authors: ['Robert C. Martin'], thumbnail: '' },
        { googleBookId: 'g2', title: 'Eloquent JavaScript', authors: ['Marijn Haverbeke'], thumbnail: '' },
        { googleBookId: 'g3', title: 'Designing Data-Intensive Applications', authors: ['Martin Kleppmann'], thumbnail: '' },
        { googleBookId: 'g4', title: 'JavaScript: The Good Parts', authors: ['Douglas Crockford'], thumbnail: '' },
        { googleBookId: 'g5', title: 'Introduction to Algorithms', authors: ['Cormen','Leiserson','Rivest','Stein'], thumbnail: '' }
      ]
    });

    console.log(`Seeding into DB: ${mongoose.connection.name}`);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
