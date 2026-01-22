import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './TicketConfirmationModal.css';

function TicketConfirmationModal({ isOpen, booking, onClose }) {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !booking) return null;

  const route = booking.route || {};
  const journeyDate = booking.journeyDate ? new Date(booking.journeyDate) : null;
  const bookingDate = booking.bookingDate ? new Date(booking.bookingDate) : null;

  const formatDate = (d) => d?.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) || '—';

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/bookings/${booking._id}/ticket`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) {
        const errorText = await res.text();
        alert(`Download failed: ${res.status} - ${errorText}`);
        throw new Error('Download failed');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${booking.pnr}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="ticket-modal-overlay">
      <div className="ticket-modal">
        <div className="ticket-header">
          <div className="ticket-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2.5a1.5 1.5 0 0 0 0 3V16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2.5a1.5 1.5 0 0 0 0-3V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 9.5h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 14h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M11 14h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 14h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="label">PNR</p>
            <h2 className="pnr-value">{booking.pnr}</h2>
          </div>
        </div>

        <div className="ticket-body">
          <div className="ticket-row">
            <div>
              <p className="label">From</p>
              <h3>{route.from || '—'}</h3>
            </div>
            <div>
              <p className="label">To</p>
              <h3>{route.to || '—'}</h3>
            </div>
          </div>

          <div className="ticket-row">
            <div>
              <p className="label">Journey Date</p>
              <p className="value">{formatDate(journeyDate)}</p>
            </div>
            <div>
              <p className="label">Departure</p>
              <p className="value">{route.departureTime || '—'}</p>
            </div>
            <div>
              <p className="label">Arrival</p>
              <p className="value">{route.arrivalTime || '—'}</p>
            </div>
          </div>

          <div className="ticket-row">
            <div>
              <p className="label">Seats</p>
              <p className="value">{booking.seatNumbers?.join(', ') || '—'}</p>
            </div>
            <div>
              <p className="label">Total Amount</p>
              <p className="value price">₹{booking.totalAmount}</p>
            </div>
          </div>

          <div className="ticket-row">
            <div>
              <p className="label">Bus</p>
              <p className="value">{booking.bus?.busName || route.bus?.busName || '—'}</p>
            </div>
            <div>
              <p className="label">Booked On</p>
              <p className="value">{formatDate(bookingDate)}</p>
            </div>
          </div>
        </div>

        <div className="ticket-actions">
          <button className="btn-outline" onClick={onClose}>Close</button>
          <button className="btn-outline" onClick={handleDownload} disabled={downloading}>
            {downloading ? 'Downloading...' : 'Download Ticket'}
          </button>
          <button className="btn-primary" onClick={() => navigate('/my-bookings')}>
            Go to My Bookings
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketConfirmationModal;
