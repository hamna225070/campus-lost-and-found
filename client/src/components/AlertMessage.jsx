import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const AlertMessage = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle size={18} style={{ flexShrink: 0 }} />;
      case 'success':
        return <CheckCircle2 size={18} style={{ flexShrink: 0 }} />;
      case 'warning':
        return <AlertTriangle size={18} style={{ flexShrink: 0 }} />;
      case 'info':
      default:
        return <Info size={18} style={{ flexShrink: 0 }} />;
    }
  };

  return (
    <div className={`alert alert-${type}`}>
      {getIcon()}
      <div style={{ flex: 1 }}>{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'transparent', color: 'inherit', padding: 0 }}
          aria-label="Close message"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
