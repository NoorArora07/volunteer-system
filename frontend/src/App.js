import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VolunteerDashboard from './pages/VolunteerDashboard';
import VolunteerForm from './pages/VolunteerForm';
import AdminDashboard from './pages/AdminDashboard';
import AdminVolunteers from './pages/AdminVolunteers';
import AdminVolunteerDetail from './pages/AdminVolunteerDetail';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />

      {/* Volunteer Routes */}
      <Route path="/dashboard" element={<PrivateRoute><VolunteerDashboard /></PrivateRoute>} />
      <Route path="/volunteer-form" element={<PrivateRoute><VolunteerForm /></PrivateRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/volunteers" element={<AdminRoute><AdminVolunteers /></AdminRoute>} />
      <Route path="/admin/volunteers/:id" element={<AdminRoute><AdminVolunteerDetail /></AdminRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
