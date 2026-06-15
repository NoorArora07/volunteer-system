const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Personal Info
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
    required: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  // Address
  address: {
    street: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: {
      type: String,
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    }
  },
  // Professional Info
  education: {
    type: String,
    enum: ['High School', 'Diploma', 'Bachelor\'s', 'Master\'s', 'PhD', 'Other'],
    required: true
  },
  occupation: {
    type: String,
    trim: true
  },
  organization: {
    type: String,
    trim: true
  },
  // Volunteering Details
  skills: [{
    type: String,
    enum: [
      'Teaching/Tutoring', 'Medical/Healthcare', 'Legal Aid', 'Tech & IT',
      'Counseling', 'Event Management', 'Fundraising', 'Content Writing',
      'Photography/Videography', 'Social Media', 'Translation', 'Other'
    ]
  }],
  interests: [{
    type: String,
    enum: [
      'Child Education', 'Women Empowerment', 'Environment', 'Healthcare',
      'Elder Care', 'Animal Welfare', 'Disaster Relief', 'Arts & Culture'
    ]
  }],
  availability: {
    weekdays: { type: Boolean, default: false },
    weekends: { type: Boolean, default: false },
    hoursPerWeek: {
      type: String,
      enum: ['1-5 hrs', '5-10 hrs', '10-20 hrs', '20+ hrs']
    }
  },
  experience: {
    type: String,
    trim: true,
    maxlength: [500, 'Experience description cannot exceed 500 characters']
  },
  motivation: {
    type: String,
    trim: true,
    maxlength: [500, 'Motivation cannot exceed 500 characters']
  },
  // Status
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Active', 'Inactive'],
    default: 'Pending'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

VolunteerSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);
