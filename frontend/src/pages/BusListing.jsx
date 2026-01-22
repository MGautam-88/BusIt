import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { routeAPI } from '../services/api';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import DatePicker from '../components/DatePicker';

function BusListing({ token }) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const [modifySearch, setModifySearch] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: searchParams.get('date') || ''
  });

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  useEffect(() => {
    setModifySearch({
      from: searchParams.get('from') || '',
      to: searchParams.get('to') || '',
      date: searchParams.get('date') || ''
    });
    searchBuses();
  }, [searchParams]);

  const searchBuses = async () => {
    try {
      setLoading(true);
      const params = {
        from: searchParams.get('from'),
        to: searchParams.get('to'),
        date: searchParams.get('date')
      };

      const response = await routeAPI.searchRoutes(params);
      // Filter out routes with null bus reference
      const validRoutes = response.data.filter(route => route.bus !== null);
      setRoutes(validRoutes);
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to search buses';
      setError(errorMsg);
    } finally {
      setLoading(false);
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

  const swapCities = () => {
    setModifySearch(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const handleModifySearch = () => {
    if (!modifySearch.from || !modifySearch.to || !modifySearch.date) {
      setToastMessage('Please fill all search fields');
      setToastType('warning');
      setShowToast(true);
      return;
    }
    navigate(`/buses?from=${modifySearch.from}&to=${modifySearch.to}&date=${modifySearch.date}`);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/home';
  };

  if (loading) return <div className="loading">Searching for buses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="bus-listing-page">
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
          {token && <button onClick={() => navigate('/my-bookings')}>My Bookings</button>}
          {token && <button onClick={() => navigate('/dashboard')}>Profile</button>}
          {token && <button onClick={handleLogout} className="logout-btn">Logout</button>}
          {!token && <button onClick={() => navigate('/login')} className="login-btn">Login</button>}
          {!token && <button onClick={() => navigate('/register')} className="register-btn">Register</button>}
        </div>
      </nav>

      <div className="listing-container">
        <div className="modify-search-panel">
          <div className="modify-search-form">
            <div className="form-field">
              <label>From</label>
              <select
                value={modifySearch.from}
                onChange={(e) => setModifySearch({ ...modifySearch, from: e.target.value })}
              >
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <button className="swap-cities-btn" onClick={swapCities} type="button" title="Swap From and To">
              ⇄
            </button>

            <div className="form-field">
              <label>To</label>
              <select
                value={modifySearch.to}
                onChange={(e) => setModifySearch({ ...modifySearch, to: e.target.value })}
              >
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Date</label>
              <DatePicker
                value={modifySearch.date}
                onChange={(date) => setModifySearch({ ...modifySearch, date })}
              />
            </div>

            <button className="search-buses-btn" onClick={handleModifySearch}>
              Search Buses
            </button>
          </div>
        </div>

        <div className="search-summary">
          <h2>Available Buses</h2>
          <p className="results-count">{routes.length} buses found</p>
        </div>

        {routes.length === 0 ? (
          <div className="no-results">
            <h3>No buses found</h3>
            <p>Try searching for different cities or dates</p>
            <button onClick={() => navigate('/home')}>Back to Search</button>
          </div>
        ) : (
          <div className="bus-list">
            {routes.map((route) => (
              !route.bus ? null : (
              <div key={route._id} className="bus-card">
                <div className="bus-info">
                  <div className="bus-header">
                    <h3>{route.bus.busName}</h3>
                    <span className="bus-type">{route.bus.busType}</span>
                  </div>
                  <p className="bus-number">Bus No: {route.bus.busNumber}</p>
                  {route.bus.amenities && route.bus.amenities.length > 0 && (
                    <div className="amenities">
                      {route.bus.amenities.map((amenity, idx) => (
                        <span key={idx} className="amenity-tag">{amenity}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="route-info">
                  <div className="time-info">
                    <div className="time-block">
                      <span className="time">{route.departureTime}</span>
                      <span className="location">{route.from}</span>
                    </div>
                    <div className="duration">
                      <span>{route.duration}</span>
                    </div>
                    <div className="time-block">
                      <span className="time">{route.arrivalTime}</span>
                      <span className="location">{route.to}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-info">
                  <div className="seats-available">
                    <p>{route.availableSeats} seats available</p>
                  </div>
                  <div className="price">
                    <span className="amount">₹{route.price}</span>
                    <span className="per-seat">per seat</span>
                  </div>
                  <button 
                    className="select-seats-btn"
                    onClick={() => {
                      if (!token) {
                        setToastMessage('Please login to book tickets');
                        setToastType('warning');
                        setShowToast(true);
                      } else {
                        navigate(`/seat-selection/${route._id}`);
                      }
                    }}
                    disabled={route.availableSeats === 0}
                  >
                    {route.availableSeats === 0 ? 'Sold Out' : 'Select Seats'}
                  </button>
                </div>
              </div>
              )
            ))}
          </div>
        )}
      </div>

      {showLogoutConfirm && (
        <ConfirmDialog
          message="Are you sure you want to logout?"
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  );
}

export default BusListing;
