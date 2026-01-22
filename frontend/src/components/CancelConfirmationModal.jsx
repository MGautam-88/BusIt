import './CancelConfirmationModal.css';

function CancelConfirmationModal({ isOpen, onConfirm, onCancel, processing }) {
  if (!isOpen) return null;

  return (
    <div className="cancel-modal-overlay">
      <div className="cancel-confirmation-modal">
        <div className="warning-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 7v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="17" r="1" fill="currentColor"/>
          </svg>
        </div>
        
        <h2>Cancel Booking?</h2>
        <p className="cancel-message">
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>

        <div className="cancel-modal-actions">
          <button 
            className="btn-cancel-action" 
            onClick={onCancel}
            disabled={processing}
          >
            No, Keep It
          </button>
          <button 
            className="btn-confirm-cancel" 
            onClick={onConfirm}
            disabled={processing}
          >
            {processing ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelConfirmationModal;
