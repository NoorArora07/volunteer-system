import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import AdminSidebar from '../components/admin/AdminSidebar';

const COLORS = ['#1a7a4a', '#f4a422', '#48bb78', '#e53e3e', '#805ad5'];

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/stats')
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  const monthlyChartData = (stats?.monthlyData || []).map(d => ({
    name: MONTH_NAMES[d._id.month - 1],
    Registrations: d.count
  }));

  const skillsChartData = (stats?.skillsData || []).map(d => ({ name: d._id, value: d.count }));
  const statusData = [
    { name: 'Pending', value: stats?.pending || 0 },
    { name: 'Approved', value: stats?.approved || 0 },
    { name: 'Active', value: stats?.active || 0 },
    { name: 'Rejected', value: stats?.rejected || 0 },
  ].filter(d => d.value > 0);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="page-header">
          <h1>Dashboard Overview</h1>
          <p>Volunteer registrations and activity at a glance</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-value" style={{ color: 'var(--primary)' }}>{stats?.total || 0}</div>
            <div className="stat-label">Total Volunteers</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-value" style={{ color: 'var(--accent)' }}>{stats?.pending || 0}</div>
            <div className="stat-label">Pending Review</div>
          </div>
          <div className="stat-card success">
            <div className="stat-value" style={{ color: '#48bb78' }}>{stats?.approved || 0}</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-card success">
            <div className="stat-value" style={{ color: '#3182ce' }}>{stats?.active || 0}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card danger">
            <div className="stat-value" style={{ color: 'var(--danger)' }}>{stats?.rejected || 0}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Monthly registrations bar chart */}
          <div className="card">
            <div className="card-title">📅 Monthly Registrations (Last 6 months)</div>
            {monthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="Registrations" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state"><div className="empty-state-icon">📊</div><p>No data yet</p></div>
            )}
          </div>

          {/* Status pie chart */}
          <div className="card">
            <div className="card-title">📋 Status Distribution</div>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state"><div className="empty-state-icon">🥧</div><p>No data yet</p></div>
            )}
          </div>
        </div>

        {/* Skills & Cities */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card">
            <div className="card-title">🛠 Top Skills</div>
            {skillsChartData.length > 0 ? (
              <div>
                {skillsChartData.slice(0, 6).map((s, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                      <span>{s.name}</span><span style={{ fontWeight: 600 }}>{s.value}</span>
                    </div>
                    <div style={{ background: 'var(--border)', borderRadius: 4, height: 6 }}>
                      <div style={{ background: 'var(--primary)', height: 6, borderRadius: 4, width: `${(s.value / skillsChartData[0].value) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state"><p>No data yet</p></div>
            )}
          </div>

          <div className="card">
            <div className="card-title">🏙 Top Cities</div>
            {(stats?.cityData || []).length > 0 ? (
              <div>
                {stats.cityData.map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ background: 'var(--primary)', color: 'white', width: 20, height: 20, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>{i + 1}</span>
                      {c._id || 'Unknown'}
                    </span>
                    <span style={{ fontWeight: 600 }}>{c.count} volunteers</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state"><p>No data yet</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
