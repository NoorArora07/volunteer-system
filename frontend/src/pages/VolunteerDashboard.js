import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  Pending: { icon: '⏳', color: 'pending', msg: 'Your application is under review. We\'ll notify you within 3–5 working days.' },
  Approved: { icon: '✅', color: 'approved', msg: 'Congratulations! Your application has been approved.' },
  Active: { icon: '🌟', color: 'active', msg: 'You\'re an active volunteer! Thank you for your dedication.' },
  Rejected: { icon: '❌', color: 'rejected', msg: 'Unfortunately your application wasn\'t approved this time. Contact us for more info.' },
  Inactive: { icon: '😴', color: 'inactive', msg: 'Your volunteer status is currently inactive.' },
};

export default function VolunteerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/volunteers/me')
      .then(res => setVolunteer(res.data.data))
      .catch(() => setVolunteer(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  const statusInfo = volunteer ? STATUS_CONFIG[volunteer.status] : null;

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">🦋</div>
          <span className="navbar-title">Naye Pankh Foundation</span>
        </Link>
        <div className="navbar-actions">
          <span className="navbar-user">👤 {user?.name}</span>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container" style={{ padding: '32px 24px' }}>
        <div className="page-header">
          <h1>My Volunteer Dashboard</h1>
          <p>Welcome back, {user?.name}! Here's your volunteering overview.</p>
        </div>

        {!volunteer ? (
          /* No registration yet */
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
            <h2 style={{ marginBottom: 12 }}>Complete Your Registration</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>
              You haven't submitted your volunteer registration yet.<br />
              It only takes a few minutes!
            </p>
            <Link to="/volunteer-form" className="btn btn-primary btn-lg">
              Start Registration →
            </Link>
          </div>
        ) : (
          <div>
            {/* Status Banner */}
            <div className={`status-banner ${statusInfo.color}`}>
              <span className="status-icon">{statusInfo.icon}</span>
              <div>
                <strong>Status: {volunteer.status}</strong>
                <p style={{ fontSize: '0.875rem', marginTop: 2 }}>{statusInfo.msg}</p>
              </div>
            </div>

            {/* Profile Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
              <div className="card">
                <div className="card-title">📋 Registration Summary</div>
                <div style={{ display: 'grid', gap: 12 }}>
                  {[
                    ['Full Name', volunteer.fullName],
                    ['Phone', volunteer.phone],
                    ['Gender', volunteer.gender],
                    ['Education', volunteer.education],
                    ['Occupation', volunteer.occupation || '—'],
                    ['City', volunteer.address?.city],
                    ['State', volunteer.address?.state],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                      <span style={{ fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card">
                  <div className="card-title">🛠 Skills</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {(volunteer.skills || []).map(s => (
                      <span key={s} style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 500 }}>{s}</span>
                    ))}
                    {!volunteer.skills?.length && <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No skills added</span>}
                  </div>
                </div>
                <div className="card">
                  <div className="card-title">💚 Interests</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {(volunteer.interests || []).map(i => (
                      <span key={i} style={{ background: 'var(--accent-light)', color: 'var(--warning)', padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 500 }}>{i}</span>
                    ))}
                    {!volunteer.interests?.length && <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No interests added</span>}
                  </div>
                </div>
                <div className="card">
                  <div className="card-title">🕐 Availability</div>
                  <p style={{ fontSize: '0.875rem' }}>
                    {[volunteer.availability?.weekdays && 'Weekdays', volunteer.availability?.weekends && 'Weekends'].filter(Boolean).join(', ') || '—'}
                  </p>
                  {volunteer.availability?.hoursPerWeek && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      {volunteer.availability.hoursPerWeek} per week
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <Link to="/volunteer-form" className="btn btn-secondary">Edit My Profile</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
