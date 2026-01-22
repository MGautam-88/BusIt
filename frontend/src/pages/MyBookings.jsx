import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import Toast from '../components/Toast';
import CancelConfirmationModal from '../components/CancelConfirmationModal';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [downloading, setDownloading] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      setCancelling(true);
      await bookingAPI.cancelBooking(selectedBookingId);
      fetchBookings();
      setShowCancelModal(false);
      setSelectedBookingId(null);
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Unable to cancel booking');
      setToastType('error');
      setShowToast(true);
    } finally {
      setCancelling(false);
    }
  };

  const handleCancelModal = () => {
    setShowCancelModal(false);
    setSelectedBookingId(null);
  };

  const handleDownloadTicket = async (bookingId, pnr) => {
    try {
      setDownloading(prev => ({ ...prev, [bookingId]: true }));
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/bookings/${bookingId}/ticket`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) {
        throw new Error('Download failed');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${pnr}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setToastMessage('Unable to download ticket. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setDownloading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div className="loading">Loading your bookings...</div>;

  return (
    <div className="my-bookings-page">
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={4000}
          onClose={() => setShowToast(false)}
        />
      )}
      <nav className="navbar">
        <div className="nav-brand">
          <h2 onClick={() => navigate('/home')}>BusIt</h2>
        </div>
        <div className="nav-links">
          <button onClick={() => navigate('/home')}>Home</button>
          <button onClick={() => navigate('/my-bookings')}>My Bookings</button>
          <button onClick={() => navigate('/dashboard')}>Profile</button>
        </div>
      </nav>

      <div className="bookings-container">
        <h1>My Bookings</h1>
        
        {error && <div className="error">{error}</div>}

        {bookings.length === 0 ? (
          <div className="no-bookings">
            <h3>No bookings yet</h3>
            <p>Start booking your bus tickets now!</p>
            <button onClick={() => navigate('/home')}>Search Buses</button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => {
              // Safety checks for populated fields
              const route = booking.route || {};
              const bus = booking.bus || {};
              
              return (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <div>
                      <h3>PNR: {booking.pnr}</h3>
                      <span className={`status-badge ${booking.bookingStatus}`}>
                        {booking.bookingStatus.toUpperCase()}
                      </span>
                    </div>
                    <div className="booking-date">
                      <small>Booked on: {formatDate(booking.bookingDate)}</small>
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="detail-section">
                      <h4>Journey Details</h4>
                      <p><strong>Route:</strong> {route.from || 'N/A'} → {route.to || 'N/A'}</p>
                      <p><strong>Date:</strong> {formatDate(booking.journeyDate)}</p>
                      {route.departureTime && route.arrivalTime && (
                        <p><strong>Time:</strong> {route.departureTime} - {route.arrivalTime}</p>
                      )}
                    </div>

                    <div className="detail-section">
                      <h4>Bus Details</h4>
                      <p><strong>Bus:</strong> {bus.busName || 'N/A'}</p>
                      <p><strong>Type:</strong> {bus.busType || 'N/A'}</p>
                      {bus.busNumber && <p><strong>Bus No:</strong> {bus.busNumber}</p>}
                    </div>

                    <div className="detail-section">
                      <h4>Passenger Details</h4>
                      {booking.passengers && booking.passengers.length > 0 ? (
                        <div>
                          {booking.passengers.map((p, idx) => (
                            <div key={idx} style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: idx < booking.passengers.length - 1 ? '1px solid #eee' : 'none' }}>
                              <p><strong>Seat {p.seatNumber}:</strong> {p.name}, {p.age}yrs, {p.gender}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <p><strong>Name:</strong> {booking.passengerName || 'N/A'}</p>
                          <p><strong>Age:</strong> {booking.passengerAge || 'N/A'}</p>
                          <p><strong>Gender:</strong> {booking.passengerGender || 'N/A'}</p>
                        </>
                      )}
                    </div>

                    <div className="detail-section">
                      <h4>Seat & Payment</h4>
                      <p><strong>Seats:</strong> {booking.seatNumbers?.join(', ') || 'N/A'}</p>
                      <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
                    </div>
                  </div>

                  {booking.bookingStatus === 'confirmed' && (
                    <div className="booking-actions">
                      <button 
                        className="download-btn"
                        onClick={() => handleDownloadTicket(booking._id, booking.pnr)}
                        disabled={downloading[booking._id]}
                      >
                        {downloading[booking._id] ? 'Downloading...' : 'Download Ticket'}
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CancelConfirmationModal 
        isOpen={showCancelModal}
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelModal}
        processing={cancelling}
      />
    </div>
  );
}

export default MyBookings;
