import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/admin/AdminSidebar';

const STATUS_OPTIONS = ['', 'Pending', 'Approved', 'Active', 'Rejected', 'Inactive'];

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', city: '', page: 1 });

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.status) params.set('status', filters.status);
      if (filters.city) params.set('city', filters.city);
      params.set('page', filters.page);
      params.set('limit', 10);

      const res = await axios.get(`/api/admin/volunteers?${params}`);
      setVolunteers(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVolunteers(); }, [filters]);

  const handleExportCSV = async () => {
    try {
      const params = filters.status ? `?status=${filters.status}` : '';
      const res = await axios.get(`/api/reports/csv${params}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `volunteers_${Date.now()}.csv`;
      a.click();
      toast.success('CSV exported!');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`/api/admin/volunteers/${id}/status`, { status });
      toast.success(`Status updated to ${status}`);
      fetchVolunteers();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="page-header-row">
          <div className="page-header" style={{ paddingBottom: 0 }}>
            <h1>Volunteers</h1>
            <p>{pagination.total} total registrations</p>
          </div>
          <button className="btn btn-accent" onClick={handleExportCSV}>
            ⬇️ Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="filters-bar" style={{ marginTop: 20 }}>
          <input
            className="form-input" placeholder="🔍 Search by name or phone..."
            style={{ minWidth: 240 }}
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
          <select
            className="form-select"
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value, page: 1 })}
          >
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
          </select>
          <input
            className="form-input" placeholder="Filter by city..."
            style={{ minWidth: 180 }}
            value={filters.city}
            onChange={e => setFilters({ ...filters, city: e.target.value, page: 1 })}
          />
          <button className="btn btn-secondary btn-sm" onClick={() => setFilters({ search: '', status: '', city: '', page: 1 })}>
            Clear
          </button>
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Education</th>
                  <th>Registered</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }}></div></td></tr>
                ) : volunteers.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No volunteers found</td></tr>
                ) : volunteers.map(v => (
                  <tr key={v._id}>
                    <td style={{ fontWeight: 500 }}>{v.fullName}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{v.user?.email}</td>
                    <td>{v.phone}</td>
                    <td>{v.address?.city || '—'}</td>
                    <td>{v.education}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(v.registeredAt).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <span className={`badge badge-${v.status.toLowerCase()}`}>{v.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/admin/volunteers/${v._id}`} className="btn btn-secondary btn-sm">View</Link>
                        <select
                          className="form-select"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto', height: 'auto' }}
                          value={v.status}
                          onChange={e => handleStatusChange(v._id, e.target.value)}
                        >
                          {['Pending', 'Approved', 'Active', 'Rejected', 'Inactive'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 16 }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`btn btn-sm ${p === filters.page ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilters({ ...filters, page: p })}
                >{p}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
