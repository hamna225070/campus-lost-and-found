import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';

export const UnauthorizedPage = () => {
  return (
    <div style={{ padding: '5rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          maxWidth: '520px',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2rem',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--lost-bg)',
            color: 'var(--lost-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <ShieldX size={36} />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          Access Denied
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          You do not have administrative permissions to view or manage this section. Only registered campus administrators may access the admin portal.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>My Student Dashboard</span>
          </Link>
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
