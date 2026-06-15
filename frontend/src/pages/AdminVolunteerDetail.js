import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/admin/AdminSidebar';

export default function AdminVolunteerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(`/api/admin/volunteers/${id}`)
      .then(res => {
        setVolunteer(res.data.data);
        setNotes(res.data.data.adminNotes || '');
      })
      .catch(() => toast.error('Failed to load volunteer'))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status) => {
    setSaving(true);
    try {
      const res = await axios.patch(`/api/admin/volunteers/${id}/status`, { status, adminNotes: notes });
      setVolunteer(res.data.data);
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      await axios.patch(`/api/admin/volunteers/${id}/status`, { status: volunteer.status, adminNotes: notes });
      toast.success('Notes saved');
    } catch (err) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteVolunteer = async () => {
    if (!window.confirm('Delete this volunteer record? This action cannot be undone.')) return;
    try {
      await axios.delete(`/api/admin/volunteers/${id}`);
      toast.success('Record deleted');
      navigate('/admin/volunteers');
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!volunteer) return <div style={{ padding: 40 }}>Volunteer not found.</div>;

  const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
      <span style={{ color: 'var(--text-muted)', minWidth: 160 }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value || '—'}</span>
    </div>
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/volunteers')}>← Back</button>
          <h1 style={{ fontSize: '1.5rem' }}>{volunteer.fullName}</h1>
          <span className={`badge badge-${volunteer.status.toLowerCase()}`}>{volunteer.status}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
              <div className="card-title">👤 Personal Information</div>
              <InfoRow label="Full Name" value={volunteer.fullName} />
              <InfoRow label="Email" value={volunteer.user?.email} />
              <InfoRow label="Phone" value={volunteer.phone} />
              <InfoRow label="Gender" value={volunteer.gender} />
              <InfoRow label="Date of Birth" value={volunteer.dateOfBirth ? new Date(volunteer.dateOfBirth).toLocaleDateString('en-IN') : null} />
              <InfoRow label="Address" value={[volunteer.address?.street, volunteer.address?.city, volunteer.address?.state, volunteer.address?.pincode].filter(Boolean).join(', ')} />
            </div>

            <div className="card">
              <div className="card-title">🎓 Professional Background</div>
              <InfoRow label="Education" value={volunteer.education} />
              <InfoRow label="Occupation" value={volunteer.occupation} />
              <InfoRow label="Organisation" value={volunteer.organization} />
            </div>

            <div className="card">
              <div className="card-title">🛠 Skills & Interests</div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>SKILLS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(volunteer.skills || []).map(s => (
                    <span key={s} style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 500 }}>{s}</span>
                  ))}
                  {!volunteer.skills?.length && <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>None</span>}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>INTERESTS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(volunteer.interests || []).map(i => (
                    <span key={i} style={{ background: 'var(--accent-light)', color: 'var(--warning)', padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 500 }}>{i}</span>
                  ))}
                  {!volunteer.interests?.length && <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>None</span>}
                </div>
              </div>
              <InfoRow label="Availability" value={[volunteer.availability?.weekdays && 'Weekdays', volunteer.availability?.weekends && 'Weekends'].filter(Boolean).join(', ')} />
              <InfoRow label="Hours/week" value={volunteer.availability?.hoursPerWeek} />
            </div>

            {(volunteer.experience || volunteer.motivation) && (
              <div className="card">
                <div className="card-title">📝 Statement</div>
                {volunteer.experience && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>EXPERIENCE</div>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{volunteer.experience}</p>
                  </div>
                )}
                {volunteer.motivation && (
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>MOTIVATION</div>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{volunteer.motivation}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right column — Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="card-title">⚡ Update Status</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Approved', 'Active', 'Pending', 'Rejected', 'Inactive'].map(status => (
                  <button
                    key={status}
                    className={`btn btn-sm ${volunteer.status === status ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => updateStatus(status)}
                    disabled={saving}
                  >
                    {volunteer.status === status ? '✓ ' : ''}{status}
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-title">📋 Admin Notes</div>
              <textarea
                className="form-textarea"
                placeholder="Internal notes about this volunteer..."
                rows={5}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
              <button className="btn btn-secondary btn-sm btn-block" style={{ marginTop: 10 }} onClick={saveNotes} disabled={saving}>
                {saving ? 'Saving...' : 'Save Notes'}
              </button>
            </div>

            <div className="card">
              <div className="card-title">🗓 Timeline</div>
              <div style={{ fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Registered</span>
                  <span>{new Date(volunteer.registeredAt).toLocaleDateString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Last updated</span>
                  <span>{new Date(volunteer.updatedAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button className="btn btn-danger btn-sm" onClick={deleteVolunteer}>
              🗑 Delete Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
