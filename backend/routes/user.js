// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Your User model

// Signup
router.post('/signup', async (req, res) => {
  try {
    console.log("Received signup data:", req.body);
    const existing = await User.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Signup Error:", err); 
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});


// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    console.log("Login attempt:", req.body);
    console.log("Found user:", user);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.password !== req.body.password) {
      console.log("Password mismatch:", user.password, req.body.password);
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Delete user by ID
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
});

module.exports = router;
