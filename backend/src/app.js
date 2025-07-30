// backend/src/app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Define schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Routes

// POST /users - create new user
app.post('/users', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    const newUser = new User({ username });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /users - get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
