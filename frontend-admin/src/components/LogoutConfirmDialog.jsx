import { useEffect } from 'react';
import './LogoutConfirmDialog.css';

function LogoutConfirmDialog({ isOpen, onConfirm, onCancel }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel, isOpen]);

  if (!isOpen) return null;

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
        <h3 className="confirm-dialog-message">Are you sure you want to logout?</h3>
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

export default LogoutConfirmDialog;
