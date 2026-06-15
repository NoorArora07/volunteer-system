const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Volunteer = require('../models/Volunteer');
const { protect } = require('../middleware/auth');

// @route  POST /api/volunteers/register
// @desc   Submit volunteer registration form
router.post('/register', protect, async (req, res) => {
  try {
    const existing = await Volunteer.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already submitted a registration' });
    }

    const volunteer = await Volunteer.create({ ...req.body, user: req.user._id });

    res.status(201).json({ success: true, data: volunteer, message: 'Registration submitted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/volunteers/me
// @desc   Get my volunteer profile
router.get('/me', protect, async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'No registration found' });
    }
    res.json({ success: true, data: volunteer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  PUT /api/volunteers/me
// @desc   Update my volunteer profile
router.put('/me', protect, async (req, res) => {
  try {
    const volunteer = await Volunteer.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'No registration found' });
    }
    res.json({ success: true, data: volunteer, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
