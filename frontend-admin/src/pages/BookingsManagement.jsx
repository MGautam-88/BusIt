import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import Toast from '../components/Toast';
import './ManagementPages.css';

function BookingsManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if filter is passed via URL params
    const urlFilter = searchParams.get('filter');
    if (urlFilter) {
      setFilterStatus(urlFilter);
    } else {
      // Reset to 'all' if no filter param in URL
      setFilterStatus('all');
    }
    fetchBookings();
  }, [searchParams]);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getAll();
      setBookings(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (id) => {
    setCancellingId(id);
    setShowCancelConfirm(true);
  };

  const confirmCancel = async () => {
    try {
      const response = await bookingAPI.cancel(cancellingId);
      fetchBookings();
      setToast({ message: 'Booking cancelled successfully and seats released', type: 'success' });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Unable to cancel booking';
      setToast({ message: errorMsg, type: 'error' });
    } finally {
      setShowCancelConfirm(false);
      setCancellingId(null);
    }
  };

  const matchesBookingQuery = (b, q) => {
    const query = (q || '').trim().toLowerCase();
    if (!query) return true;
    // Handle null route or user safely
    if (!b.route || !b.user) return false;
    const status = (b.status || b.bookingStatus || 'confirmed');
    const routeStart = b.route?.startLocation || b.route?.from;
    const routeEnd = b.route?.endLocation || b.route?.to;
    const dateStr = b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : '';
    const dateIso = b.bookingDate ? new Date(b.bookingDate).toISOString().slice(0, 10) : '';
    const busName = b.bus?.busName || b.route?.bus?.busName || '';
    const busNumber = b.bus?.busNumber || b.route?.bus?.busNumber || '';
    const busType = b.bus?.busType || b.route?.bus?.busType || '';
    const fields = [
      b.pnr,
      b.passengerName,
      b.user?.email,
      routeStart,
      routeEnd,
      (b.seatNumbers || []).join(', '),
      String(b.totalAmount),
      status,
      dateStr,
      dateIso,
      busName,
      busNumber,
      busType,
    ];
    return fields.some((f) => f && f.toString().toLowerCase().includes(query));
  };

  const filteredByStatus = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => (b.status || b.bookingStatus || 'confirmed') === filterStatus);

  const filteredBookings = filteredByStatus.filter((b) => matchesBookingQuery(b, searchQuery));

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
      <div className="page-header">
        <h2>Manage Bookings</h2>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search by PNR, passenger, email, route, bus name, seats, amount, status, date"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Bookings</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading bookings...</div>
      ) : (filteredBookings.length === 0 && searchQuery.trim()) ? (
        <div className="empty-state">Nothing found for "{searchQuery}".</div>
      ) : filteredBookings.length === 0 ? (
        <div className="empty-state">No bookings found.</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>PNR</th>
                <th>Passenger Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Booking Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                !booking.route || !booking.user ? null : (
                <tr 
                  key={booking._id}
                  onClick={() => navigate(`/admin/dashboard/bookings/${booking._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td><strong>{booking.pnr}</strong></td>
                  <td>{booking.passengerName}</td>
                  <td>{booking.user?.email}</td>
                  <td>
                    <span className={`badge ${booking.status || booking.bookingStatus || 'confirmed'}`}>
                      {(booking.status || booking.bookingStatus || 'confirmed').charAt(0).toUpperCase() + (booking.status || booking.bookingStatus || 'confirmed').slice(1)}
                    </span>
                  </td>
                  <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BookingsManagement;
