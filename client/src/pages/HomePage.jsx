import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { itemService } from '../services/api';
import ItemCard from '../components/ItemCard';
import { CATEGORIES } from '../utils/formatters';

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        setLoading(true);
        const res = await itemService.getItems({ limit: 6, sort: 'newest' });
        if (res.success) {
          setRecentItems(res.items || []);
        }
      } catch (err) {
        console.error('Failed to load recent items:', err);
        setError('Could not connect to the server. Please check that the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/items');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)',
          borderBottom: '1px solid var(--border)',
          padding: '4.5rem 0 3.5rem',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '860px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#dbeafe',
              color: 'var(--primary)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
            }}
          >
            <Sparkles size={16} />
            <span>Official University Student Portal</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.25rem)',
              fontWeight: 800,
              color: 'var(--text-main)',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: '1.25rem',
            }}
          >
            Reuniting Students with Their Lost Belongings
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '2.25rem',
              maxWidth: '680px',
              marginRight: 'auto',
              marginLeft: 'auto',
            }}
          >
            Campus Lost & Found Portal is your centralized campus hub to report misplaced items, browse found property, and coordinate safe returns quickly and securely.
          </p>

          {/* Prominent Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '2px solid #bfdbfe',
              borderRadius: 'var(--radius-full)',
              padding: '0.4rem 0.6rem 0.4rem 1.5rem',
              boxShadow: 'var(--shadow-lg)',
              maxWidth: '640px',
              margin: '0 auto 2rem',
            }}
          >
            <Search size={22} color="var(--primary)" style={{ marginRight: '0.75rem', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search by item name, e.g., 'ID card', 'Casio calculator', 'Keys'..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '1rem',
                color: 'var(--text-main)',
                backgroundColor: 'transparent',
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ borderRadius: 'var(--radius-full)', padding: '0.7rem 1.5rem' }}
            >
              Search
            </button>
          </form>

          {/* Action Buttons: Report Lost & Report Found */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <Link to="/report/lost" className="btn btn-danger btn-lg">
              <PlusCircle size={20} />
              <span>Report Lost Item</span>
            </Link>
            <Link to="/report/found" className="btn btn-success btn-lg">
              <PlusCircle size={20} />
              <span>Report Found Item</span>
            </Link>
            <Link to="/items" className="btn btn-secondary btn-lg">
              <span>Browse All Listings</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Category Shortcuts */}
      <section style={{ padding: '3.5rem 0 2rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Explore by Category
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
              Jump straight to the category matching what you've lost or found
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1rem',
            }}
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/items?category=${encodeURIComponent(cat)}`}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem 0.75rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.6rem',
                  boxShadow: 'var(--shadow-sm)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Tag size={18} />
                </div>
                <span>{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Reported Items */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={20} color="var(--primary)" />
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Recently Reported Items
                </h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                Latest lost and found notices submitted by campus members
              </p>
            </div>
            <Link to="/items" className="btn btn-secondary">
              <span>View All Reports</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <span className="spinner spinner-lg"></span>
              <p>Loading recent reports...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : recentItems.length === 0 ? (
            <div className="empty-state">
              <HelpCircle size={40} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
              <h3>No items reported yet</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Be the first to report a lost or found belonging.
              </p>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/report/lost" className="btn btn-danger">Report Lost</Link>
                <Link to="/report/found" className="btn btn-success">Report Found</Link>
              </div>
            </div>
          ) : (
            <div className="cards-grid">
              {recentItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How the Portal Works Section */}
      <section
        style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '4.5rem 0',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
              How The Portal Works
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>
              Recovering lost property on campus is easy, fast, and organized in three simple steps.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Step 1 */}
            <div
              style={{
                backgroundColor: 'var(--bg-page)',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  margin: '0 auto 1.25rem',
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                Submit a Report
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Log into your student account and submit details about the lost or found item, including campus location, date, and description.
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                backgroundColor: 'var(--bg-page)',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  margin: '0 auto 1.25rem',
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                Search & Filter
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Search through active listings by item name, filter by category (electronics, IDs, books), or filter by campus building.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                backgroundColor: 'var(--bg-page)',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--found-color)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  margin: '0 auto 1.25rem',
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                Connect & Recover
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Reach out to the finder or owner using the contact info provided, verify ownership safely, and mark the report resolved!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
