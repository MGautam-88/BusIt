import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import BusesManagement from './pages/BusesManagement';
import RoutesManagement from './pages/RoutesManagement';
import BookingsManagement from './pages/BookingsManagement';
import BookingDetail from './pages/BookingDetail';
import UsersManagement from './pages/UsersManagement';
import './App.css';

function App() {
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('adminToken');
  });

  const ProtectedRoute = ({ children }) => {
    return adminToken ? children : <Navigate to="/admin/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin setAdminToken={setAdminToken} />} />
        
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard adminToken={adminToken} setAdminToken={setAdminToken} />
            </ProtectedRoute>
          }
        >
          <Route index element={<div className="page-content">Select an option from the sidebar</div>} />
          <Route path="buses" element={<BusesManagement />} />
          <Route path="routes" element={<RoutesManagement />} />
          <Route path="bookings" element={<BookingsManagement />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
          <Route path="users" element={<UsersManagement />} />
        </Route>

        <Route path="/" element={<Navigate to="/admin/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
