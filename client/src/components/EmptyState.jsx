import React from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = Search,
  title = 'No items found',
  description = 'Try adjusting your search criteria or filter options to find what you are looking for.',
  actionLabel,
  actionLink,
  onActionClick,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={32} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionLabel && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onActionClick && (
        <button onClick={onActionClick} className="btn btn-secondary">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
