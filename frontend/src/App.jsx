import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import BusListing from './pages/BusListing';
import SeatSelection from './pages/SeatSelection';
import MyBookings from './pages/MyBookings';
import './App.css';

function AppRoutes() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const location = useLocation();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route path="/register" element={<Register setToken={setToken} />} />
      <Route 
        path="/home" 
        element={<Home token={token} />}
      />
      <Route 
        path="/buses" 
        element={<BusListing token={token} />}
      />
      <Route 
        path="/seat-selection/:routeId" 
        element={
          <PrivateRoute>
            <SeatSelection />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/my-bookings" 
        element={
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard setToken={setToken} />
          </PrivateRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/home" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
