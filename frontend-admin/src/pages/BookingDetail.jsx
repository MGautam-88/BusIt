import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import Toast from '../components/Toast';
import './BookingDetail.css';

function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const response = await bookingAPI.getById(id);
      setBooking(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = async () => {
    try {
      const response = await bookingAPI.cancel(id);
      setShowCancelConfirm(false);
      setToast({ message: 'Booking cancelled successfully and seats released', type: 'success' });
      setTimeout(() => {
        navigate('/admin/dashboard/bookings');
      }, 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Unable to cancel booking';
      setToast({ message: errorMsg, type: 'error' });
      setShowCancelConfirm(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading booking details...</div>;
  }

  if (!booking) {
    return <div className="error">Booking not found</div>;
  }

  const status = booking.status || booking.bookingStatus || 'confirmed';
  const route = booking.route || {};
  const bus = route.bus || booking.bus || {};

  return (
    <div className="management-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {showCancelConfirm && (
        <div className="confirm-overlay" onClick={() => setShowCancelConfirm(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Cancellation</h3>
            <p>Are you sure you want to cancel this booking?</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowCancelConfirm(false)}>No, Keep It</button>
              <button className="btn-delete" onClick={confirmCancel}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className="booking-detail-header">
        <button className="btn-back" onClick={() => navigate('/admin/dashboard/bookings')}>
          ← Back to Bookings
        </button>
        <div className="booking-header-info">
          <div>
            <h2>PNR: {booking.pnr}</h2>
            <span className={`badge ${status}`}>
              {status.toUpperCase()}
            </span>
          </div>
          <div className="booking-date-info">
            Booked on: {new Date(booking.bookingDate).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      <div className="booking-detail-grid">
        {/* Journey Details */}
        <div className="detail-card">
          <h3>Journey Details</h3>
          <div className="detail-item">
            <span className="detail-label">Route:</span>
            <span className="detail-value">{route.startLocation || route.from || '-'} → {route.endLocation || route.to || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{route.date ? new Date(route.date).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Time:</span>
            <span className="detail-value">{route.departureTime || '-'} - {route.arrivalTime || '-'}</span>
          </div>
        </div>

        {/* Bus Details */}
        <div className="detail-card">
          <h3>Bus Details</h3>
          <div className="detail-item">
            <span className="detail-label">Bus:</span>
            <span className="detail-value">{bus.busName || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Type:</span>
            <span className="detail-value">{bus.busType || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Bus No:</span>
            <span className="detail-value">{bus.busNumber || '-'}</span>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="detail-card">
          <h3>Passenger Details</h3>
          {booking.passengers && booking.passengers.length > 0 ? (
            booking.passengers.map((passenger, index) => (
              <div key={index} className="passenger-info">
                <strong>Seat {passenger.seatNumber}:</strong> {passenger.name}, {passenger.age}yrs, {passenger.gender}
              </div>
            ))
          ) : (
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{booking.passengerName}</span>
            </div>
          )}
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{booking.user?.email}</span>
          </div>
        </div>

        {/* Seat & Payment */}
        <div className="detail-card">
          <h3>Seat & Payment</h3>
          <div className="detail-item">
            <span className="detail-label">Seats:</span>
            <span className="detail-value">{booking.seatNumbers?.join(', ') || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Total Amount:</span>
            <span className="detail-value amount">₹{booking.totalAmount}</span>
          </div>
        </div>
      </div>

      {status !== 'cancelled' && (
        <div className="booking-actions">
          <button className="btn-cancel-booking" onClick={handleCancelBooking}>
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
}

export default BookingDetail;
