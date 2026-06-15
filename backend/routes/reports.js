const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Volunteer = require('../models/Volunteer');

router.use(protect, adminOnly);

// @route  GET /api/reports/csv
// @desc   Export volunteers to CSV
router.get('/csv', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const volunteers = await Volunteer.find(query).populate('user', 'email').lean();

    const headers = [
      'Full Name', 'Email', 'Phone', 'Gender', 'Date of Birth',
      'City', 'State', 'Education', 'Occupation', 'Skills',
      'Interests', 'Availability', 'Status', 'Registered On'
    ];

    const rows = volunteers.map(v => [
      v.fullName,
      v.user?.email || '',
      v.phone,
      v.gender,
      v.dateOfBirth ? new Date(v.dateOfBirth).toLocaleDateString('en-IN') : '',
      v.address?.city || '',
      v.address?.state || '',
      v.education,
      v.occupation || '',
      (v.skills || []).join('; '),
      (v.interests || []).join('; '),
      `${v.availability?.weekdays ? 'Weekdays ' : ''}${v.availability?.weekends ? 'Weekends' : ''}`.trim(),
      v.status,
      new Date(v.registeredAt).toLocaleDateString('en-IN')
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="volunteers_${Date.now()}.csv"`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/reports/summary
// @desc   Summary stats for reporting
router.get('/summary', async (req, res) => {
  try {
    const total = await Volunteer.countDocuments();
    const byStatus = await Volunteer.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const byGender = await Volunteer.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);
    const byEducation = await Volunteer.aggregate([
      { $group: { _id: '$education', count: { $sum: 1 } } }
    ]);
    const recentRegistrations = await Volunteer.find()
      .sort({ registeredAt: -1 })
      .limit(5)
      .populate('user', 'email')
      .select('fullName status registeredAt address.city');

    res.json({
      success: true,
      data: { total, byStatus, byGender, byEducation, recentRegistrations }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
