import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

export default function LandingPage() {
  const features = [
    { icon: '📋', title: 'Easy Registration', desc: 'Simple multi-step form to capture all volunteer details' },
    { icon: '🔐', title: 'Secure Account', desc: 'Your data is protected with JWT-based authentication' },
    { icon: '📊', title: 'Track Status', desc: 'View your registration status and updates in real-time' },
    { icon: '🤝', title: 'Make an Impact', desc: 'Connect with communities and causes that matter' },
  ];

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">🦋</div>
          <span className="navbar-title">Naye Pankh Foundation</span>
        </Link>
        <div className="navbar-actions">
          <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Volunteer Now</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">🌱 Join 500+ Volunteers</div>
            <h1>Give Wings to <span>Change</span></h1>
            <p>
              Naye Pankh Foundation connects passionate volunteers with meaningful causes.
              Register today and start your journey of giving back to the community.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-hero">Register as Volunteer</Link>
              <Link to="/login" className="btn btn-hero-outline">Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: '2rem', marginBottom: 12 }}>Why Volunteer with Us?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              We make it easy to connect your skills with the communities that need them.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 0', background: 'var(--primary-light)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: 12 }}>Ready to Make a Difference?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>
            It takes less than 5 minutes to register. Your journey starts here.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">Get Started Today →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a202c', color: '#a0aec0', padding: '32px 0', textAlign: 'center' }}>
        <div className="container">
          <p>© {new Date().getFullYear()} Naye Pankh Foundation. All rights reserved.</p>
          <p style={{ marginTop: 8, fontSize: '0.8rem' }}>Built with ❤️ to empower communities</p>
        </div>
      </footer>
    </div>
  );
}
