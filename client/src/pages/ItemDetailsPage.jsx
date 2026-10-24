import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Tag,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { itemService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import AlertMessage from '../components/AlertMessage';
import { formatDate, DEFAULT_ITEM_PLACEHOLDER } from '../utils/formatters';

export const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);

  // Modals & action states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await itemService.getItemById(id);
        if (res.success && res.item) {
          setItem(res.item);
        } else {
          setError('Item report not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  // Ownership permission check
  const isOwner =
    isAuthenticated &&
    item &&
    item.user &&
    (item.user._id === user?._id || item.user === user?._id);

  const canManage = isOwner || isAdmin;

  // Toggle status between open and resolved
  const handleToggleStatus = async () => {
    if (!item) return;
    const newStatus = item.status === 'open' ? 'resolved' : 'open';

    try {
      setActionLoading(true);
      const res = await itemService.updateStatus(item._id, newStatus);
      if (res.success && res.item) {
        setItem(res.item);
        setActionFeedback({
          type: 'success',
          message: `Report status updated to "${newStatus}"`,
        });
      }
    } catch (err) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Failed to update status',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Delete item handler
  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true);
      await itemService.deleteItem(id);
      setDeleteModalOpen(false);
      navigate('/items', { replace: true });
    } catch (err) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Failed to delete item report',
      });
      setActionLoading(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <span className="spinner spinner-lg"></span>
        <p>Loading item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', maxWidth: '600px' }}>
        <AlertMessage type="error" message={error || 'Item not found'} />
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/items" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Back to All Listings</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Navigation & Action Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          {canManage && (
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={actionLoading}
                className={`btn btn-sm ${item.status === 'open' ? 'btn-success' : 'btn-secondary'}`}
              >
                <CheckCircle2 size={16} />
                <span>{item.status === 'open' ? 'Mark as Resolved' : 'Reopen Report'}</span>
              </button>

              <Link to={`/items/${item._id}/edit`} className="btn btn-secondary btn-sm">
                <Edit size={16} />
                <span>Edit</span>
              </Link>

              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="btn btn-danger-outline btn-sm"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {actionFeedback && (
          <AlertMessage
            type={actionFeedback.type}
            message={actionFeedback.message}
            onClose={() => setActionFeedback(null)}
          />
        )}

        {/* Main Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.4fr)',
            gap: '2.5rem',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Image Column */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              minHeight: '340px',
              borderRight: '1px solid var(--border)',
            }}
          >
            <img
              src={item.imageUrl && item.imageUrl.trim() !== '' ? item.imageUrl : DEFAULT_ITEM_PLACEHOLDER}
              alt={item.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_ITEM_PLACEHOLDER;
              }}
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '460px',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Details Content Column */}
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <StatusBadge type={item.type} />
              <StatusBadge status={item.status} />
              <span className="badge badge-category">
                <Tag size={13} />
                {item.category}
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                lineHeight: 1.3,
                marginBottom: '1rem',
              }}
            >
              {item.title}
            </h1>

            {/* Meta tags */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                padding: '1rem',
                backgroundColor: 'var(--bg-page)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                border: '1px solid var(--border)',
                fontSize: '0.9rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Campus Location:</strong> {item.location}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Date {item.type === 'lost' ? 'Lost' : 'Found'}:</strong>{' '}
                  {formatDate(item.dateOfIncident)}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Reported on:</strong> {formatDate(item.createdAt)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.5rem', flex: 1 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Description
              </h3>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {item.description}
              </p>
            </div>

            {/* Contact Information Box */}
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: '#eff6ff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #bfdbfe',
                marginTop: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <Phone size={18} color="var(--primary)" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>
                  How to Contact
                </h4>
              </div>
              <p style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>
                {item.contactInfo}
              </p>
              <div
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <User size={13} />
                <span>
                  Reported by: {item.user?.name || 'Campus Student'} ({item.user?.role || 'student'})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Deletion */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Item Report"
        message={`Are you sure you want to delete the report for "${item.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete Report"
        isDanger={true}
        loading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ItemDetailsPage;
