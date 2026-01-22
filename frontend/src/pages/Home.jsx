import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from '../components/DatePicker';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

function Home({ token }) {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: ''
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!searchData.from || !searchData.to || !searchData.date) {
      setToastMessage('Please select from city, to city, and travel date');
      setShowToast(true);
      return;
    }
    
    navigate(`/buses?from=${searchData.from}&to=${searchData.to}&date=${searchData.date}`);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/home';
  };

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  return (
    <div className="home-page">
      {showToast && (
        <Toast
          message={toastMessage}
          type="warning"
          duration={4000}
          onClose={() => setShowToast(false)}
        />
      )}
      <nav className="navbar">
        <div className="nav-brand">
          <h2>BusIt</h2>
        </div>
        <div className="nav-links">
          <button onClick={() => navigate('/home')}>Home</button>
          {token && <button onClick={() => navigate('/my-bookings')}>My Bookings</button>}
          {token && <button onClick={() => navigate('/dashboard')}>Profile</button>}
          {token ? (
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="login-btn">Login</button>
              <button onClick={() => navigate('/register')} className="register-btn">Register</button>
            </>
          )}
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <h1>Book Your Bus Tickets</h1>
          <p>Travel with comfort and convenience</p>

          <div className="search-container">
            <form className="search-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>From</label>
                  <select
                    value={searchData.from}
                    onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>To</label>
                  <select
                    value={searchData.to}
                    onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <DatePicker
                    value={searchData.date}
                    onChange={(date) => setSearchData({ ...searchData, date })}
                    required
                  />
                </div>

                <button type="submit" className="search-btn">Search Buses</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🎫 Easy Booking</h3>
            <p>Quick and hassle-free bus ticket booking</p>
          </div>
          <div className="feature-card">
            <h3>💺 Seat Selection</h3>
            <p>Choose your preferred seats</p>
          </div>
          <div className="feature-card">
            <h3>💳 Secure Payment</h3>
            <p>Safe and secure payment gateway</p>
          </div>
          <div className="feature-card">
            <h3>📱 Instant Confirmation</h3>
            <p>Get booking confirmation instantly</p>
          </div>
        </div>
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

export default Home;
