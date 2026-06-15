import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  const navItems = [
    { path: '/admin', icon: '📊', label: 'Dashboard' },
    { path: '/admin/volunteers', icon: '👥', label: 'Volunteers' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🦋</div>
        <div className="sidebar-logo">Naye Pankh</div>
        <div className="sidebar-subtitle">Admin Panel</div>
      </div>
      <ul className="sidebar-nav">
        {navItems.map(item => (
          <li key={item.path}>
            <Link to={item.path} className={pathname === item.path ? 'active' : ''}>
              {item.icon} {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div style={{ position: 'absolute', bottom: 24, left: 12, right: 12 }}>
        <button className="btn btn-secondary btn-block btn-sm" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
