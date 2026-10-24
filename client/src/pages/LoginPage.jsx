import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setError('Please provide both your email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(formData.email.trim(), formData.password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to fill demo account
  const fillDemo = (role) => {
    if (role === 'student') {
      setFormData({ email: 'student@campus.edu', password: 'Student@12345' });
    } else {
      setFormData({ email: 'admin@campus.edu', password: 'Admin@12345' });
    }
    setError('');
  };

  return (
    <div style={{ padding: '3.5rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              color: 'white',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <Compass size={30} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Log in to manage your lost & found reports
          </p>
        </div>

        <div className="form-card">
          {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Campus Email Address <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="student@campus.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password <span className="required">*</span>
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Log In</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper for presentation */}
          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border)',
              fontSize: '0.8rem',
              textAlign: 'center',
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
              Quick Demo Fill (Capstone Presentation):
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.4rem' }}>
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              >
                Demo Student
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              >
                Demo Admin
              </button>
            </div>
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              textAlign: 'center',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              borderTop: '1px solid var(--border)',
              paddingTop: '1rem',
            }}
          >
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: 'var(--accent)' }}>
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
