import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  Tag,
  Clock,
} from 'lucide-react';
import { dashboardService, itemService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import AlertMessage from '../components/AlertMessage';
import EmptyState from '../components/EmptyState';
import { formatDate } from '../utils/formatters';

export const StudentDashboardPage = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalReports: 0,
    lostCount: 0,
    foundCount: 0,
    resolvedCount: 0,
    openCount: 0,
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Deletion modal
  const [itemToDelete, setItemToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardService.getStudentDashboard();
      if (res.success) {
        setStats(res.stats);
        setItems(res.items || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your student dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'open' ? 'resolved' : 'open';
    try {
      setActionLoading(true);
      await itemService.updateStatus(item._id, newStatus);
      setMessage({
        type: 'success',
        text: `"${item.title}" marked as ${newStatus}`,
      });
      fetchDashboardData();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to update report status',
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
        text: `Report for "${itemToDelete.title}" was deleted`,
      });
      setItemToDelete(null);
      fetchDashboardData();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to delete item report',
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
        <p>Loading your personal dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
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
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Student Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              Welcome back, <strong>{user?.name}</strong>. Manage your campus lost and found submissions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/report/lost" className="btn btn-danger btn-sm">
              <PlusCircle size={16} />
              <span>Report Lost</span>
            </Link>
            <Link to="/report/found" className="btn btn-success btn-sm">
              <PlusCircle size={16} />
              <span>Report Found</span>
            </Link>
          </div>
        </div>

        {error && <AlertMessage type="error" message={error} />}
        {message && (
          <AlertMessage
            type={message.type}
            message={message.text}
            onClose={() => setMessage(null)}
          />
        )}

        {/* Real DB Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div
              className="stat-icon-wrapper"
              style={{ backgroundColor: '#eff6ff', color: 'var(--primary)' }}
            >
              <FileText size={26} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalReports}</div>
              <div className="stat-label">Total Reports</div>
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
              <div className="stat-label">Lost Items</div>
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
              <div className="stat-label">Found Items</div>
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

        {/* My Reports Table Section */}
        <div style={{ marginTop: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
            My Active & Resolved Listings ({items.length})
          </h2>

          {items.length === 0 ? (
            <EmptyState
              title="You haven't reported any items yet"
              description="Misplaced a personal possession or found something on campus? Create your first report to get started."
              actionLabel="Report Lost Item"
              actionLink="/report/lost"
            />
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
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
                            <CheckCircle2 size={14} color={item.status === 'open' ? 'var(--found-color)' : 'var(--text-muted)'} />
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
                            title="View full details"
                          >
                            <ExternalLink size={14} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setItemToDelete(item)}
                            className="btn btn-danger-outline btn-sm"
                            title="Delete report"
                            disabled={actionLoading}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        title="Delete Your Report"
        message={`Are you sure you want to permanently delete "${itemToDelete?.title}"?`}
        confirmText="Yes, Delete"
        isDanger={true}
        loading={actionLoading}
        onConfirm={handleDeleteItem}
        onClose={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default StudentDashboardPage;
