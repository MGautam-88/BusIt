import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingConfirmationModal.css';

function BookingConfirmationModal({ isOpen, bookingData, onClose, onConfirm }) {
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayNow = async () => {
    setProcessing(true);
    await onConfirm();
    setProcessing(false);
  };

  const handleCancel = () => {
    onClose();
  };

  const totalAmount = bookingData?.totalAmount || 0;
  const seatCount = bookingData?.seatNumbers?.length || 0;

  return (
    <div className="modal-overlay">
      <div className="confirmation-modal">
        <div className="payment-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
            <path d="M6 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        
        <h2>Complete Your Payment</h2>
        <p className="confirmation-message">Review your booking details and proceed with payment to confirm your seats.</p>
        
        <div className="payment-details">
          <div className="detail-row">
            <span>Number of Seats</span>
            <strong>{seatCount}</strong>
          </div>
          <div className="detail-row">
            <span>Total Amount</span>
            <strong>₹{totalAmount}</strong>
          </div>
        </div>

        <p className="payment-note">Pay now to confirm your seat</p>

        <div className="modal-actions">
          <button 
            className="btn-cancel" 
            onClick={handleCancel}
            disabled={processing}
          >
            Cancel
          </button>
          <button 
            className="btn-pay-now" 
            onClick={handlePayNow}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmationModal;
