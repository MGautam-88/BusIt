import { useState, useEffect } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import LogoutConfirmDialog from '../components/LogoutConfirmDialog';
import './AdminDashboard.css';

function AdminDashboard({ adminToken, setAdminToken }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on the main dashboard page (not on a sub-route)
  const isMainDashboard = location.pathname === '/admin/dashboard';

  useEffect(() => {
    // Check if admin is logged in
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    const user = localStorage.getItem('adminUser');
    if (user) {
      setAdminUser(JSON.parse(user));
    }

    fetchStats();
  }, [adminToken]);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminToken(null);
    setShowLogoutDialog(false);
    navigate('/admin/login');
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
  };

  if (!adminToken) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>BusIt Admin</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className="nav-item">
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </Link>
          <Link to="/admin/dashboard/buses" className="nav-item">
            <span className="nav-icon">🚌</span>
            <span className="nav-text">Buses</span>
          </Link>
          <Link to="/admin/dashboard/routes" className="nav-item">
            <span className="nav-icon">🛣️</span>
            <span className="nav-text">Routes</span>
          </Link>
          <Link to="/admin/dashboard/bookings" className="nav-item">
            <span className="nav-icon">📋</span>
            <span className="nav-text">Bookings</span>
          </Link>
          <Link to="/admin/dashboard/users" className="nav-item">
            <span className="nav-icon">👥</span>
            <span className="nav-text">Users</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <p><strong>{adminUser?.name}</strong></p>
            <p className="user-role">{adminUser?.role}</p>
          </div>
          <button className="logout-btn" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <h1>Dashboard</h1>
          <div className="top-bar-right">
            <span>{adminUser?.email}</span>
          </div>
        </header>

        <div className="content-area">
          {/* Stats Section - Only show on main dashboard */}
          {isMainDashboard && (
            <>
              {loading ? (
                <div className="loading">Loading statistics...</div>
              ) : stats ? (
                <div className="stats-grid">
                  <div className="stat-card" onClick={() => navigate('/admin/dashboard/users')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                      <p className="stat-label">Total Users</p>
                      <p className="stat-value">{stats?.totalUsers || 0}</p>
                    </div>
                  </div>

                  <div className="stat-card" onClick={() => navigate('/admin/dashboard/users')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon">👨‍💼</div>
                    <div className="stat-content">
                      <p className="stat-label">Total Admins</p>
                      <p className="stat-value">{stats?.totalAdmins || 0}</p>
                    </div>
                  </div>

                  <div className="stat-card" onClick={() => navigate('/admin/dashboard/buses')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon">🚌</div>
                    <div className="stat-content">
                      <p className="stat-label">Total Buses</p>
                      <p className="stat-value">{stats?.totalBuses || 0}</p>
                    </div>
                  </div>

                  <div className="stat-card" onClick={() => navigate('/admin/dashboard/routes')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon">🛣️</div>
                    <div className="stat-content">
                      <p className="stat-label">Total Routes</p>
                      <p className="stat-value">{stats?.totalRoutes || 0}</p>
                    </div>
                  </div>

                  <div className="stat-card" onClick={() => navigate('/admin/dashboard/bookings')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                      <p className="stat-label">Total Bookings</p>
                      <p className="stat-value">{stats?.totalBookings || 0}</p>
                    </div>
                  </div>

                  <div className="stat-card" onClick={() => navigate('/admin/dashboard/bookings?filter=confirmed')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                      <p className="stat-label">Confirmed Bookings</p>
                      <p className="stat-value">{stats?.confirmedBookings || 0}</p>
                    </div>
                  </div>

                  <div className="stat-card" onClick={() => navigate('/admin/dashboard/bookings?filter=cancelled')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon">❌</div>
                    <div className="stat-content">
                      <p className="stat-label">Cancelled Bookings</p>
                      <p className="stat-value">{stats?.cancelledBookings || 0}</p>
                    </div>
                  </div>

                  <div className="stat-card highlight" onClick={() => navigate('/admin/dashboard/bookings')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                      <p className="stat-label">Total Revenue</p>
                      <p className="stat-value">₹{(stats?.totalRevenue || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          )}

          {/* Sub-routes will render here */}
          <Outlet context={{ fetchStats }} />
        </div>
      </main>

      <LogoutConfirmDialog 
        isOpen={showLogoutDialog}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </div>
  );
}

export default AdminDashboard;
