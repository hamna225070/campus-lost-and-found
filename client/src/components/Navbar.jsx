import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  PlusCircle,
  Search,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo & Name */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-icon">
            <Compass size={24} />
          </div>
          <span>Campus Lost & Found</span>
          <span className="brand-badge">Portal</span>
        </Link>

        {/* Mobile menu trigger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Navigation Links */}
        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/items"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <Search size={16} />
            Browse Items
          </NavLink>

          <NavLink
            to="/report/lost"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <PlusCircle size={16} color="var(--lost-color)" />
            Report Lost
          </NavLink>

          <NavLink
            to="/report/found"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <PlusCircle size={16} color="var(--found-color)" />
            Report Found
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <LayoutDashboard size={16} />
              My Dashboard
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <ShieldAlert size={16} color="#b45309" />
              Admin Panel
            </NavLink>
          )}

          {/* Mobile-only action buttons */}
          {mobileMenuOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              {isAuthenticated ? (
                <>
                  <div className="user-menu-pill">
                    <User size={14} />
                    <span>{user?.name}</span>
                    <span className={`role-tag ${user?.role}`}>{user?.role}</span>
                  </div>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                    <LogOut size={16} />
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary btn-sm" onClick={closeMenu}>
                    <LogIn size={16} />
                    Log In
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                    <UserPlus size={16} />
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>

        {/* Desktop User actions */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="user-menu-pill" title={user?.email}>
                <User size={15} color="var(--primary)" />
                <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name}
                </span>
                <span className={`role-tag ${user?.role}`}>{user?.role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log out securely">
                <LogOut size={15} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={15} />
                <span>Log In</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={15} />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
