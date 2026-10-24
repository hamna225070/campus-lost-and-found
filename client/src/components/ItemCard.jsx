import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, ArrowRight } from 'lucide-react';
import { formatDate, DEFAULT_ITEM_PLACEHOLDER } from '../utils/formatters';
import StatusBadge from './StatusBadge';

export const ItemCard = ({ item }) => {
  const { _id, title, description, category, type, location, dateOfIncident, imageUrl, status } = item;

  return (
    <div className="item-card">
      <div className="card-img-wrapper">
        <img
          src={imageUrl && imageUrl.trim() !== '' ? imageUrl : DEFAULT_ITEM_PLACEHOLDER}
          alt={title}
          className="card-img"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_ITEM_PLACEHOLDER;
          }}
          loading="lazy"
        />
        <div className="card-badges-floating">
          <StatusBadge type={type} />
        </div>
        <div className="card-status-floating">
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="card-body">
        <div style={{ marginBottom: '0.4rem' }}>
          <span className="badge badge-category">
            <Tag size={12} />
            {category}
          </span>
        </div>

        <h3 className="card-title" title={title}>
          {title}
        </h3>

        <p className="card-description">
          {description}
        </p>

        <div className="card-meta">
          <div className="meta-row">
            <MapPin size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {location}
            </span>
          </div>
          <div className="meta-row">
            <Calendar size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <span>Date: {formatDate(dateOfIncident)}</span>
          </div>
        </div>

        <div className="card-footer">
          <Link to={`/items/${_id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            <span>View Details</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
