const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// @route  GET /api/admin/volunteers
// @desc   Get all volunteers with filters & pagination
router.get('/volunteers', async (req, res) => {
  try {
    const { status, city, skill, page = 1, limit = 10, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (skill) query.skills = skill;
    if (search) {
      query.$or = [
        { fullName: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') }
      ];
    }

    const total = await Volunteer.countDocuments(query);
    const volunteers = await Volunteer.find(query)
      .populate('user', 'name email')
      .sort({ registeredAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: volunteers,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/admin/volunteers/:id
// @desc   Get single volunteer
router.get('/volunteers/:id', async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id).populate('user', 'name email');
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer not found' });
    res.json({ success: true, data: volunteer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  PATCH /api/admin/volunteers/:id/status
// @desc   Update volunteer status (approve/reject/etc.)
router.patch('/volunteers/:id/status', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes, updatedAt: Date.now() },
      { new: true }
    ).populate('user', 'name email');

    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer not found' });
    res.json({ success: true, data: volunteer, message: `Status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  DELETE /api/admin/volunteers/:id
// @desc   Delete a volunteer record
router.delete('/volunteers/:id', async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer not found' });
    res.json({ success: true, message: 'Volunteer record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/admin/stats
// @desc   Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [total, pending, approved, active, rejected] = await Promise.all([
      Volunteer.countDocuments(),
      Volunteer.countDocuments({ status: 'Pending' }),
      Volunteer.countDocuments({ status: 'Approved' }),
      Volunteer.countDocuments({ status: 'Active' }),
      Volunteer.countDocuments({ status: 'Rejected' })
    ]);

    // Registrations by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Volunteer.aggregate([
      { $match: { registeredAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: '$registeredAt' }, year: { $year: '$registeredAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Skills distribution
    const skillsData = await Volunteer.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    // City distribution
    const cityData = await Volunteer.aggregate([
      { $group: { _id: '$address.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: { total, pending, approved, active, rejected, monthlyData, skillsData, cityData }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  POST /api/admin/create-admin
// @desc   Create admin user (one-time setup or by existing admin)
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });
    const admin = await User.create({ name, email, password, role: 'admin' });
    res.status(201).json({ success: true, message: 'Admin created successfully', data: { id: admin._id, name, email } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
