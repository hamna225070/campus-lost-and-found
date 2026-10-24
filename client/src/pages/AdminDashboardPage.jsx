import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  FileText,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Edit,
  Tag,
  Search,
  Filter,
} from 'lucide-react';
import { dashboardService, itemService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import AlertMessage from '../components/AlertMessage';
import { formatDate } from '../utils/formatters';

export const AdminDashboardPage = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalAdmins: 0,
    totalItems: 0,
    lostCount: 0,
    foundCount: 0,
    resolvedCount: 0,
    openCount: 0,
  });

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Moderation / Deletion modal
  const [itemToDelete, setItemToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getAdminDashboard();
      if (res.success) {
        setStats(res.stats);
        setItems(res.items || []);
        setFilteredItems(res.items || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch admin dashboard records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Filter items based on local search or type filter
  useEffect(() => {
    let result = [...items];

    if (filterType !== 'all') {
      result = result.filter((i) => i.type === filterType);
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (i) =>
          i.title?.toLowerCase().includes(term) ||
          i.location?.toLowerCase().includes(term) ||
          i.user?.name?.toLowerCase().includes(term) ||
          i.user?.email?.toLowerCase().includes(term)
      );
    }

    setFilteredItems(result);
  }, [searchTerm, filterType, items]);

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'open' ? 'resolved' : 'open';
    try {
      setActionLoading(true);
      await itemService.updateStatus(item._id, newStatus);
      setMessage({
        type: 'success',
        text: `Item "${item.title}" status changed to ${newStatus}`,
      });
      fetchAdminData();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to update status',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      setActionLoading(true);
      await itemService.deleteItem(itemToDelete._id);
      setMessage({
        type: 'success',
        text: `Moderation notice: Listing "${itemToDelete.title}" has been deleted.`,
      });
      setItemToDelete(null);
      fetchAdminData();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to delete listing',
      });
      setItemToDelete(null);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <span className="spinner spinner-lg"></span>
        <p>Loading administrator moderation dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldAlert size={28} color="var(--primary)" />
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Campus Administration Dashboard
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            System-wide statistics, user metrics, and listing moderation tools
          </p>
        </div>

        {error && <AlertMessage type="error" message={error} />}
        {message && (
          <AlertMessage
            type={message.type}
            message={message.text}
            onClose={() => setMessage(null)}
          />
        )}

        {/* Admin Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div
              className="stat-icon-wrapper"
              style={{ backgroundColor: '#eff6ff', color: 'var(--primary)' }}
            >
              <Users size={26} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">
                Users ({stats.totalStudents} students, {stats.totalAdmins} admin)
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon-wrapper"
              style={{ backgroundColor: '#f1f5f9', color: 'var(--text-main)' }}
            >
              <FileText size={26} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalItems}</div>
              <div className="stat-label">Total Listings</div>
            </div>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon-wrapper"
              style={{ backgroundColor: 'var(--lost-bg)', color: 'var(--lost-color)' }}
            >
              <AlertCircle size={26} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.lostCount}</div>
              <div className="stat-label">Lost Reports</div>
            </div>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon-wrapper"
              style={{ backgroundColor: 'var(--found-bg)', color: 'var(--found-color)' }}
            >
              <CheckCircle2 size={26} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.foundCount}</div>
              <div className="stat-label">Found Reports</div>
            </div>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon-wrapper"
              style={{ backgroundColor: 'var(--resolved-bg)', color: 'var(--resolved-color)' }}
            >
              <CheckCircle2 size={26} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.resolvedCount}</div>
              <div className="stat-label">Resolved Items</div>
            </div>
          </div>
        </div>

        {/* Listings Moderation Table */}
        <div style={{ marginTop: '2.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>
              All Campus Listings Moderation ({filteredItems.length})
            </h2>

            {/* Quick search and filter inside table */}
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Filter by title, location, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ width: '240px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              />

              <select
                className="form-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{ width: '130px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              >
                <option value="all">All Types</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item Title</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Reported By</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Moderation</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No listings match your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item._id}>
                      <td style={{ fontWeight: 600 }}>
                        <Link to={`/items/${item._id}`} style={{ color: 'var(--text-main)' }}>
                          {item.title}
                        </Link>
                      </td>
                      <td>
                        <StatusBadge type={item.type} />
                      </td>
                      <td>
                        <span className="badge badge-category">{item.category}</span>
                      </td>
                      <td>{item.location}</td>
                      <td>{formatDate(item.dateOfIncident)}</td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          <div>{item.user?.name || 'Unknown'}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            {item.user?.email || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item)}
                            className="btn btn-secondary btn-sm"
                            title={item.status === 'open' ? 'Mark Resolved' : 'Reopen'}
                            disabled={actionLoading}
                          >
                            <CheckCircle2
                              size={14}
                              color={item.status === 'open' ? 'var(--found-color)' : 'var(--text-muted)'}
                            />
                          </button>

                          <Link
                            to={`/items/${item._id}/edit`}
                            className="btn btn-secondary btn-sm"
                            title="Edit report"
                          >
                            <Edit size={14} />
                          </Link>

                          <Link
                            to={`/items/${item._id}`}
                            className="btn btn-secondary btn-sm"
                            title="View details"
                          >
                            <ExternalLink size={14} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setItemToDelete(item)}
                            className="btn btn-danger-outline btn-sm"
                            title="Moderate & delete this listing"
                            disabled={actionLoading}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete / Moderation Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        title="Admin Moderation: Delete Listing"
        message={`Are you sure you want to remove the listing "${itemToDelete?.title}" reported by ${itemToDelete?.user?.name || 'student'}? This will remove it from all student searches.`}
        confirmText="Confirm Removal"
        isDanger={true}
        loading={actionLoading}
        onConfirm={handleDeleteItem}
        onClose={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default AdminDashboardPage;
