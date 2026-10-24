import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Heart } from 'lucide-react';
import { CATEGORIES } from '../utils/formatters';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div>
            <div className="footer-brand">
              <Compass size={22} />
              <span>Campus Lost & Found</span>
            </div>
            <p className="footer-desc">
              A centralized university portal empowering college students and staff to quickly report, track, and recover lost personal belongings across campus.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} color="var(--found-color)" />
              <span>Academic Capstone Project &bull; ICTAK</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home Page</Link></li>
              <li><Link to="/items">Browse All Items</Link></li>
              <li><Link to="/report/lost">Report Lost Item</Link></li>
              <li><Link to="/report/found">Report Found Item</Link></li>
              <li><Link to="/dashboard">Student Dashboard</Link></li>
            </ul>
          </div>

          {/* Category Shortcuts */}
          <div>
            <h4 className="footer-heading">Popular Categories</h4>
            <ul className="footer-links">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat}>
                  <Link to={`/items?category=${encodeURIComponent(cat)}`}>{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Campus Support */}
          <div>
            <h4 className="footer-heading">Campus Helpdesk</h4>
            <ul className="footer-links">
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Main Campus Security Office
              </li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Student Center Room 102
              </li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Email: security@campus.edu
              </li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Helpline: (555) 019-9900
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Campus Lost & Found Portal. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Built with MERN Stack <Heart size={14} color="#ef4444" fill="#ef4444" /> for Student Capstone
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
