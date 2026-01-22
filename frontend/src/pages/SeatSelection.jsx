import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { routeAPI, bookingAPI } from '../services/api';
import Toast from '../components/Toast';
import BookingConfirmationModal from '../components/BookingConfirmationModal';
import TicketConfirmationModal from '../components/TicketConfirmationModal';

function SeatSelection() {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passengerData, setPassengerData] = useState({
    name: '',
    age: '',
    gender: 'Male'
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [passengerDataList, setPassengerDataList] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  // Keep passenger forms in sync with selected seats
  useEffect(() => {
    setPassengerDataList(prev => {
      const map = new Map();
      // Preserve existing inputs by seat number order
      selectedSeats.forEach((seat, idx) => {
        const existing = prev[idx] || {};
        map.set(idx, {
          name: existing.name || '',
          age: existing.age || '',
          gender: existing.gender || 'Male',
        });
      });
      return Array.from(map.values());
    });
  }, [selectedSeats]);

  const updatePassenger = (index, partial) => {
    setPassengerDataList(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...partial };
      return next;
    });
  };

  useEffect(() => {
    fetchRoute();
  }, [routeId]);

  const fetchRoute = async () => {
    try {
      const response = await routeAPI.getRouteById(routeId);
      // Check if route has valid bus reference
      if (!response.data || !response.data.bus) {
        setError('Route not found or bus information is missing');
        return;
      }
      setRoute(response.data);
    } catch (err) {
      setError('Failed to load route details');
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seatNumber) => {
    if (route.bookedSeats.includes(seatNumber)) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      if (selectedSeats.length < 5) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      } else {
        setToastMessage('Maximum 5 seats can be selected');
        setToastType('warning');
        setShowToast(true);
      }
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (selectedSeats.length === 0) {
      setToastMessage('Please select at least one seat');
      setToastType('warning');
      setShowToast(true);
      return;
    }

    // Validate passenger data
    for (let i = 0; i < selectedSeats.length; i++) {
      const passenger = passengerDataList[i];
      if (!passenger?.name || !passenger?.name.trim()) {
        setToastMessage(`Please enter name for seat ${selectedSeats[i]}`);
        setToastType('warning');
        setShowToast(true);
        return;
      }
      if (!passenger?.age || passenger.age < 1 || passenger.age > 120) {
        setToastMessage(`Please enter a valid age for seat ${selectedSeats[i]}`);
        setToastType('warning');
        setShowToast(true);
        return;
      }
    }

    // Prepare booking data
    const passengers = selectedSeats.map((seat, idx) => ({
      name: passengerDataList[idx]?.name || '',
      age: parseInt(passengerDataList[idx]?.age || '0'),
      gender: passengerDataList[idx]?.gender || 'Male',
      seatNumber: seat,
    }));

    const bookingData = {
      routeId: route._id,
      seatNumbers: selectedSeats,
      passengers,
      totalAmount,
      // Legacy fields for compatibility
      passengerName: passengers[0]?.name || '',
      passengerAge: passengers[0]?.age || 0,
      passengerGender: passengers[0]?.gender || 'Male'
    };

    // Show payment modal first
    setPendingBookingData(bookingData);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    try {
      setBookingLoading(true);
      const response = await bookingAPI.createBooking(pendingBookingData);
      setCompletedBooking(response.data);
      setShowPaymentModal(false);
      setShowTicketModal(true);
      
      // Refetch route to get updated booked seats
      await fetchRoute();
      // Clear selected seats after successful booking
      setSelectedSeats([]);
      setPassengerDataList([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
      setShowPaymentModal(false);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    setPendingBookingData(null);
  };

  const getSeatPrice = (seatNumber) => {
    const base = route.price;
    const index = seatNumber - 1;
    const col = index % 4;
    const row = Math.floor(index / 4);
    let tier = 0;
    // Window seats premium
    if (col === 0 || col === 3) tier += 100;
    // Front rows slightly premium
    if (row < 2) tier += 120;
    // Middle rows slight discount
    if (row >= 4 && row < 6) tier -= 90;
    return Math.max(0, base + tier);
  };

  const renderDeck = (deck) => {
    const totalSeats = route.bus.totalSeats;
    const seatsPerDeck = Math.ceil(totalSeats / 2);
    const start = deck === 'lower' ? 1 : seatsPerDeck + 1;
    const end = deck === 'lower' ? seatsPerDeck : totalSeats;

    const items = [];
    for (let i = start; i <= end; i++) {
      const isBooked = route.bookedSeats.includes(i);
      const isSelected = selectedSeats.includes(i);
      const price = getSeatPrice(i);
      const isMale = i % 2 === 0;
      const iconClass = isMale ? 'seat-icon-male' : 'seat-icon-female';

      items.push(
        <div
          key={i}
          className={`seat-card ${isBooked ? 'sold' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => !isBooked && toggleSeat(i)}
        >
          <div className={`seat-rect ${isBooked ? 'sold' : ''} ${isSelected ? 'selected' : ''}`}>
            <div className={iconClass}></div>
            <div className="seat-footrest"></div>
            <div className="seat-number-badge">{i}</div>
          </div>
          <div className="seat-price">₹{price}</div>
          {isBooked && <div className="seat-sold">Sold</div>}
        </div>
      );

      // Maintain spacing similar to 4-column grid
      if ((i - start + 1) % 4 === 0 && i !== end) {
        items.push(<div key={`aisle-${deck}-${i}`} className="aisle"></div>);
      }
    }
    return items;
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error && !route) return <div className="error">{error}</div>;
  if (!route) return <div>Route not found</div>;

  const totalAmount = selectedSeats.length * route.price;

  return (
    <div className="seat-selection-page">
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
        </div>
      </nav>

      <div className="seat-container">
        <div className="route-summary">
          <h2>Select Your Seats</h2>
          <div className="trip-info">
            <p><strong>{route.from}</strong> → <strong>{route.to}</strong></p>
            <p>{route.bus.busName} ({route.bus.busType})</p>
            <p>{route.departureTime} - {route.arrivalTime}</p>
          </div>
        </div>

        <div className="seat-layout-container">
          <div className="dd-container">
            <div className="deck">
              <div className="deck-title">
                <span>Lower deck</span>
                <span className="steering-icon">🛞</span>
              </div>
              <div className="seats-grid">
                {renderDeck('lower')}
              </div>
            </div>
            <div className="deck">
              <div className="deck-title">
                <span>Upper deck</span>
              </div>
              <div className="seats-grid">
                {renderDeck('upper')}
              </div>
            </div>
          </div>
        </div>

        <div className="booking-form">
          <h3>Passenger Details</h3>
          {error && <div className="error">{error}</div>}
          
          <form onSubmit={handleBooking}>
            {selectedSeats.map((seat, idx) => (
              <div key={seat} className="passenger-card">
                <div className="passenger-header">
                  <strong>Seat {seat}</strong>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={passengerDataList[idx]?.name || ''}
                      onChange={(e) => updatePassenger(idx, { name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      value={passengerDataList[idx]?.age || ''}
                      onChange={(e) => updatePassenger(idx, { age: e.target.value })}
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={passengerDataList[idx]?.gender || 'Male'}
                      onChange={(e) => updatePassenger(idx, { gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <div className="booking-summary">
              <div className="summary-row">
                <span>Selected Seats:</span>
                <span>{selectedSeats.join(', ') || 'None'}</span>
              </div>
              <div className="summary-row">
                <span>Number of Seats:</span>
                <span>{selectedSeats.length}</span>
              </div>
              <div className="summary-row">
                <span>Price per Seat:</span>
                <span>₹{route.price}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <button 
              type="submit" 
              className="book-btn"
              disabled={selectedSeats.length === 0 || bookingLoading}
            >
              {bookingLoading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>

      <BookingConfirmationModal 
        isOpen={showPaymentModal}
        bookingData={pendingBookingData}
        onClose={handleCancelPayment}
        onConfirm={handleConfirmPayment}
      />

      <TicketConfirmationModal 
        isOpen={showTicketModal}
        booking={completedBooking}
        onClose={() => setShowTicketModal(false)}
      />
    </div>
  );
}

export default SeatSelection;
