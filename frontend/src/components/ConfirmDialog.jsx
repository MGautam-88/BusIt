import { useEffect } from 'react';

function ConfirmDialog({ message, onConfirm, onCancel }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="confirm-dialog-backdrop" onClick={handleBackdropClick}>
      <div className="confirm-dialog-container">
        <div className="confirm-dialog-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h3 className="confirm-dialog-message">{message}</h3>
        <div className="confirm-dialog-buttons">
          <button onClick={onCancel} className="confirm-dialog-btn cancel-btn">
            Cancel
          </button>
          <button onClick={onConfirm} className="confirm-dialog-btn confirm-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
