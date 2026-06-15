import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const SKILLS = [
  'Teaching/Tutoring', 'Medical/Healthcare', 'Legal Aid', 'Tech & IT',
  'Counseling', 'Event Management', 'Fundraising', 'Content Writing',
  'Photography/Videography', 'Social Media', 'Translation', 'Other'
];
const INTERESTS = [
  'Child Education', 'Women Empowerment', 'Environment', 'Healthcare',
  'Elder Care', 'Animal Welfare', 'Disaster Relief', 'Arts & Culture'
];

export default function VolunteerForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    address: { street: '', city: '', state: '', pincode: '' },
    education: '',
    occupation: '',
    organization: '',
    skills: [],
    interests: [],
    availability: { weekdays: false, weekends: false, hoursPerWeek: '' },
    experience: '',
    motivation: ''
  });

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const setAddr = (field, value) => setForm(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
  const setAvail = (field, value) => setForm(prev => ({ ...prev, availability: { ...prev.availability, [field]: value } }));

  const toggleArr = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const totalSteps = 4;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post('/api/volunteers/register', form);
      toast.success('Registration submitted! We\'ll review your application soon.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="volunteer-form-page">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>Volunteer Registration</h1>
        <p style={{ color: 'var(--text-muted)' }}>Step {step} of {totalSteps} — please fill in all required fields</p>
      </div>

      {/* Progress */}
      <div className="form-progress">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`form-progress-step ${i + 1 < step ? 'done' : i + 1 === step ? 'active' : ''}`} />
        ))}
      </div>

      <div className="card">
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div>
            <div className="form-section-title">👤 Personal Information</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name <span className="required">*</span></label>
                <input className="form-input" value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="As per official documents" />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth <span className="required">*</span></label>
                <input type="date" className="form-input" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender <span className="required">*</span></label>
                <select className="form-select" value={form.gender} onChange={e => set('gender', e.target.value)}>
                  <option value="">Select gender</option>
                  {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number <span className="required">*</span></label>
                <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit mobile number" maxLength={10} />
              </div>
            </div>
            <div className="form-section-title" style={{ marginTop: 24 }}>📍 Address</div>
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input className="form-input" value={form.address.street} onChange={e => setAddr('street', e.target.value)} placeholder="House/flat no., locality" />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">City <span className="required">*</span></label>
                <input className="form-input" value={form.address.city} onChange={e => setAddr('city', e.target.value)} placeholder="Your city" />
              </div>
              <div className="form-group">
                <label className="form-label">State <span className="required">*</span></label>
                <input className="form-input" value={form.address.state} onChange={e => setAddr('state', e.target.value)} placeholder="Your state" />
              </div>
              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input className="form-input" value={form.address.pincode} onChange={e => setAddr('pincode', e.target.value)} placeholder="6-digit pincode" maxLength={6} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Professional Info */}
        {step === 2 && (
          <div>
            <div className="form-section-title">🎓 Education & Profession</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Education Level <span className="required">*</span></label>
                <select className="form-select" value={form.education} onChange={e => set('education', e.target.value)}>
                  <option value="">Select level</option>
                  {["High School", "Diploma", "Bachelor's", "Master's", "PhD", "Other"].map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Occupation</label>
                <input className="form-input" value={form.occupation} onChange={e => set('occupation', e.target.value)} placeholder="Student, Engineer, Teacher..." />
              </div>
              <div className="form-group">
                <label className="form-label">Organisation / College</label>
                <input className="form-input" value={form.organization} onChange={e => set('organization', e.target.value)} placeholder="Where you work or study" />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Skills & Interests */}
        {step === 3 && (
          <div>
            <div className="form-section-title">🛠 Skills</div>
            <div className="checkbox-group" style={{ marginBottom: 32 }}>
              {SKILLS.map(skill => (
                <label key={skill} className="checkbox-item" style={{ background: form.skills.includes(skill) ? 'var(--primary-light)' : 'var(--bg)', padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.skills.includes(skill)} onChange={() => toggleArr('skills', skill)} />
                  {skill}
                </label>
              ))}
            </div>

            <div className="form-section-title">💚 Areas of Interest</div>
            <div className="checkbox-group" style={{ marginBottom: 32 }}>
              {INTERESTS.map(interest => (
                <label key={interest} className="checkbox-item" style={{ background: form.interests.includes(interest) ? 'var(--accent-light)' : 'var(--bg)', padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.interests.includes(interest)} onChange={() => toggleArr('interests', interest)} />
                  {interest}
                </label>
              ))}
            </div>

            <div className="form-section-title">🕐 Availability</div>
            <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
              <label className="checkbox-item">
                <input type="checkbox" checked={form.availability.weekdays} onChange={e => setAvail('weekdays', e.target.checked)} />
                Weekdays
              </label>
              <label className="checkbox-item">
                <input type="checkbox" checked={form.availability.weekends} onChange={e => setAvail('weekends', e.target.checked)} />
                Weekends
              </label>
            </div>
            <div className="form-group" style={{ maxWidth: 280 }}>
              <label className="form-label">Hours available per week</label>
              <select className="form-select" value={form.availability.hoursPerWeek} onChange={e => setAvail('hoursPerWeek', e.target.value)}>
                <option value="">Select range</option>
                {['1-5 hrs', '5-10 hrs', '10-20 hrs', '20+ hrs'].map(h => <option key={h}>{h}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Experience & Motivation */}
        {step === 4 && (
          <div>
            <div className="form-section-title">📝 Tell Us About Yourself</div>
            <div className="form-group">
              <label className="form-label">Prior Volunteering Experience</label>
              <textarea
                className="form-textarea" rows={4}
                placeholder="Describe any previous volunteering or community work (optional)"
                value={form.experience} onChange={e => set('experience', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Why do you want to volunteer with Naye Pankh? <span className="required">*</span></label>
              <textarea
                className="form-textarea" rows={4}
                placeholder="Share your motivation and what you hope to contribute..."
                value={form.motivation} onChange={e => set('motivation', e.target.value)}
              />
            </div>
            <div style={{ background: 'var(--primary-light)', padding: '16px 20px', borderRadius: 8, marginTop: 8 }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>
                ✅ By submitting, you confirm that all information provided is accurate.
                Our team will review your application and get back to you within 3–5 working days.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
          <button
            className="btn btn-secondary"
            onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/dashboard')}
          >
            {step === 1 ? '← Back' : '← Previous'}
          </button>
          {step < totalSteps ? (
            <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>
              Next →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : '🚀 Submit Registration'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
