import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  PlusCircle,
  Edit,
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  Phone,
  Image,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { itemService } from '../services/api';
import { CATEGORIES } from '../utils/formatters';
import AlertMessage from '../components/AlertMessage';

export const ReportItemPage = () => {
  const { id } = useParams(); // If present, we are in Edit mode
  const location = useLocation();
  const navigate = useNavigate();

  // Determine initial type from URL path: /report/lost -> 'lost', /report/found -> 'found'
  const isLostRoute = location.pathname.includes('/lost');
  const isFoundRoute = location.pathname.includes('/found');
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    type: isFoundRoute ? 'found' : 'lost',
    description: '',
    location: '',
    dateOfIncident: new Date().toISOString().split('T')[0],
    imageUrl: '',
    contactInfo: '',
    status: 'open',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(isEditMode);
  const [feedback, setFeedback] = useState(null);

  // If in edit mode, fetch the existing item data
  useEffect(() => {
    if (isEditMode) {
      const fetchItemToEdit = async () => {
        try {
          setLoadingInitial(true);
          const res = await itemService.getItemById(id);
          if (res.success && res.item) {
            const item = res.item;
            setFormData({
              title: item.title,
              category: item.category,
              type: item.type,
              description: item.description,
              location: item.location,
              dateOfIncident: item.dateOfIncident
                ? new Date(item.dateOfIncident).toISOString().split('T')[0]
                : '',
              imageUrl: item.imageUrl || '',
              contactInfo: item.contactInfo,
              status: item.status || 'open',
            });
          }
        } catch (err) {
          setFeedback({
            type: 'error',
            message: err.message || 'Failed to load item report for editing',
          });
        } finally {
          setLoadingInitial(false);
        }
      };

      fetchItemToEdit();
    } else {
      // Set type based on URL route
      if (isFoundRoute) {
        setFormData((prev) => ({ ...prev, type: 'found' }));
      } else if (isLostRoute) {
        setFormData((prev) => ({ ...prev, type: 'lost' }));
      }
    }
  }, [id, isEditMode, isFoundRoute, isLostRoute]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Item name is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Item name must be at least 2 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a detailed description';
    } else if (formData.description.trim().length < 5) {
      newErrors.description = 'Description should be at least 5 characters long';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Campus location is required';
    }

    if (!formData.dateOfIncident) {
      newErrors.dateOfIncident = 'Please provide the incident date';
    }

    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Contact details (email, phone, or office) are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (feedback) setFeedback(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);
      setFeedback(null);

      if (isEditMode) {
        const res = await itemService.updateItem(id, formData);
        setFeedback({
          type: 'success',
          message: 'Item report updated successfully! Redirecting...',
        });
        setTimeout(() => {
          navigate(`/items/${id}`);
        }, 1200);
      } else {
        const res = await itemService.createItem(formData);
        setFeedback({
          type: 'success',
          message: `${formData.type === 'lost' ? 'Lost' : 'Found'} item reported successfully! Redirecting...`,
        });
        setTimeout(() => {
          navigate(`/items/${res.item?._id || ''}`);
        }, 1200);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to submit report. Please review your details and try again.',
      });
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="loading-container">
        <span className="spinner spinner-lg"></span>
        <p>Loading report details...</p>
      </div>
    );
  }

  const pageHeading = isEditMode
    ? 'Edit Item Report'
    : formData.type === 'lost'
    ? 'Report a Lost Item'
    : 'Report a Found Item';

  const pageSubheading = isEditMode
    ? 'Update the details or status of your campus listing'
    : formData.type === 'lost'
    ? 'Provide details to help your campus community identify and return your belonging'
    : 'Help return a found item to its rightful student owner';

  return (
    <div style={{ padding: '3rem 1rem' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        {/* Navigation back */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isEditMode ? (
              <Edit size={26} color="var(--primary)" />
            ) : (
              <PlusCircle
                size={26}
                color={formData.type === 'lost' ? 'var(--lost-color)' : 'var(--found-color)'}
              />
            )}
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {pageHeading}
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            {pageSubheading}
          </p>
        </div>

        {/* Form Container */}
        <div className="form-card">
          {feedback && (
            <AlertMessage
              type={feedback.type}
              message={feedback.message}
              onClose={() => setFeedback(null)}
            />
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Report Type Selector (Lost vs Found) */}
            <div className="form-group">
              <label className="form-label">
                Report Type <span className="required">*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.85rem',
                    border: `2px solid ${formData.type === 'lost' ? 'var(--lost-color)' : 'var(--border)'}`,
                    backgroundColor: formData.type === 'lost' ? 'var(--lost-bg)' : '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: formData.type === 'lost' ? 'var(--lost-color)' : 'var(--text-secondary)',
                    transition: 'var(--transition)',
                  }}
                >
                  <input
                    type="radio"
                    name="type"
                    value="lost"
                    checked={formData.type === 'lost'}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                  />
                  <span>Lost Item</span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.85rem',
                    border: `2px solid ${formData.type === 'found' ? 'var(--found-color)' : 'var(--border)'}`,
                    backgroundColor: formData.type === 'found' ? 'var(--found-bg)' : '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: formData.type === 'found' ? 'var(--found-color)' : 'var(--text-secondary)',
                    transition: 'var(--transition)',
                  }}
                >
                  <input
                    type="radio"
                    name="type"
                    value="found"
                    checked={formData.type === 'found'}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                  />
                  <span>Found Item</span>
                </label>
              </div>
            </div>

            {/* Item Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Item Name / Title <span className="required">*</span>
              </label>
              <input
                id="title"
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Casio fx-991EX Calculator, Blue Leather Wallet, Student ID"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
                required
              />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>

            {/* Category and Date row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {/* Category */}
              <div className="form-group">
                <label className="form-label" htmlFor="category">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="form-error">{errors.category}</p>}
              </div>

              {/* Date */}
              <div className="form-group">
                <label className="form-label" htmlFor="dateOfIncident">
                  Date {formData.type === 'lost' ? 'Lost' : 'Found'} <span className="required">*</span>
                </label>
                <input
                  id="dateOfIncident"
                  type="date"
                  name="dateOfIncident"
                  className="form-input"
                  value={formData.dateOfIncident}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
                {errors.dateOfIncident && (
                  <p className="form-error">{errors.dateOfIncident}</p>
                )}
              </div>
            </div>

            {/* Campus Location */}
            <div className="form-group">
              <label className="form-label" htmlFor="location">
                Campus Location <span className="required">*</span>
              </label>
              <input
                id="location"
                type="text"
                name="location"
                className="form-input"
                placeholder="e.g. Central Library 2nd Floor, Room 204, Cafeteria"
                value={formData.location}
                onChange={handleChange}
                maxLength={120}
                required
              />
              {errors.location && <p className="form-error">{errors.location}</p>}
              <p className="form-helper">
                Specify campus building, floor, room number, or landmark where it was lost or found.
              </p>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Detailed Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                placeholder="Describe key identifying marks, color, brand, stickers, unique features, or contents..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                maxLength={2000}
                required
              />
              {errors.description && <p className="form-error">{errors.description}</p>}
            </div>

            {/* Optional Image URL */}
            <div className="form-group">
              <label className="form-label" htmlFor="imageUrl">
                Optional Image URL
              </label>
              <input
                id="imageUrl"
                type="url"
                name="imageUrl"
                className="form-input"
                placeholder="https://example.com/item-photo.jpg (optional)"
                value={formData.imageUrl}
                onChange={handleChange}
              />
              <p className="form-helper">
                Optional. You can leave this blank — an automatic placeholder will be used.
              </p>
            </div>

            {/* Contact Information */}
            <div className="form-group">
              <label className="form-label" htmlFor="contactInfo">
                Contact Information <span className="required">*</span>
              </label>
              <input
                id="contactInfo"
                type="text"
                name="contactInfo"
                className="form-input"
                placeholder="e.g. alex.j@campus.edu or 555-0192 or Room 102 Desk"
                value={formData.contactInfo}
                onChange={handleChange}
                maxLength={200}
                required
              />
              {errors.contactInfo && (
                <p className="form-error">{errors.contactInfo}</p>
              )}
              <p className="form-helper">
                How should the finder or owner reach you?
              </p>
            </div>

            {/* If in edit mode: Status selector */}
            {isEditMode && (
              <div className="form-group">
                <label className="form-label" htmlFor="status">
                  Report Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="open">Open Report</option>
                  <option value="resolved">Resolved (Returned / Closed)</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <div style={{ marginTop: '2rem' }}>
              <button
                type="submit"
                className={`btn ${formData.type === 'lost' ? 'btn-danger' : 'btn-success'}`}
                style={{ width: '100%', padding: '0.85rem' }}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner"></span>
                    <span>Saving Report...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} />
                    <span>{isEditMode ? 'Save Changes' : 'Submit Item Report'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportItemPage;
