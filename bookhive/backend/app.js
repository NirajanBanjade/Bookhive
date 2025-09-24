require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Placeholder root route
app.get('/', (req, res) => res.send('BookHive API running'));

// Import and register routes
const toReadRoutes = require('./routes/toReadRoutes');
app.use('/api/to-read', toReadRoutes);

module.exports = app;
