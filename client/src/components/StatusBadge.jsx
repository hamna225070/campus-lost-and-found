import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export const StatusBadge = ({ type, status }) => {
  return (
    <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
      {type && (
        <span className={`badge ${type === 'lost' ? 'badge-lost' : 'badge-found'}`}>
          <AlertCircle size={13} />
          {type === 'lost' ? 'Lost Item' : 'Found Item'}
        </span>
      )}
      {status && (
        <span className={`badge ${status === 'open' ? 'badge-open' : 'badge-resolved'}`}>
          {status === 'open' ? <Clock size={13} /> : <CheckCircle2 size={13} />}
          {status === 'open' ? 'Open Report' : 'Resolved'}
        </span>
      )}
    </div>
  );
};

export default StatusBadge;
