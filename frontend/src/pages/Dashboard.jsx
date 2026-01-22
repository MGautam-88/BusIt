import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';

function Dashboard({ setToken }) {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await userAPI.getCurrentUser();
      setUser(response.data);
      setEditedUser(response.data);
    } catch (error) {
      setToastMessage('Failed to load profile');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditedUser({ ...user });
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedUser({ ...user });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await userAPI.updateProfile({
        name: editedUser.name,
        email: editedUser.email,
        gender: editedUser.gender || null,
        dob: editedUser.dob || null,
        mobile: editedUser.mobile || null,
      });
      setUser(response.data);
      setEditedUser(response.data);
      setEditMode(false);
      setToastMessage('Profile updated successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      setToastMessage(error.response?.data?.message || 'Failed to update profile');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setToken(null);
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
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
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h1>My Profile</h1>
            {!editMode && (
              <button className="edit-profile-btn" onClick={handleEdit}>
                Edit Profile
              </button>
            )}
          </div>

          <div className="profile-content">
            <div className="profile-section">
              <h2 className="section-title">Personal Information</h2>
              
              <div className="profile-field-row">
                <label>Name</label>
                {editMode ? (
                  <input
                    type="text"
                    value={editedUser.name || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="profile-input"
                  />
                ) : (
                  <p className="profile-value">{user?.name}</p>
                )}
              </div>

              <div className="profile-field-row">
                <label>Email</label>
                {editMode ? (
                  <input
                    type="email"
                    value={editedUser.email || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    className="profile-input"
                  />
                ) : (
                  <p className="profile-value">{user?.email}</p>
                )}
              </div>

              <div className="profile-field-row">
                <label>Mobile Number</label>
                {editMode ? (
                  <input
                    type="tel"
                    value={editedUser.mobile || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, mobile: e.target.value })}
                    className="profile-input"
                  />
                ) : (
                  <p className="profile-value">{user?.mobile ? user.mobile : 'Not defined'}</p>
                )}
              </div>

              <div className="profile-field-row">
                <label>Gender</label>
                {editMode ? (
                  <select
                    value={editedUser.gender || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, gender: e.target.value || null })}
                    className="profile-input"
                  >
                    <option value="">Not defined</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="profile-value">{user?.gender ? user.gender : 'Not defined'}</p>
                )}
              </div>

              <div className="profile-field-row">
                <label>Date of Birth</label>
                {editMode ? (
                  <input
                    type="date"
                    value={editedUser.dob ? new Date(editedUser.dob).toISOString().split('T')[0] : ''}
                    onChange={(e) => setEditedUser({ ...editedUser, dob: e.target.value ? new Date(e.target.value) : null })}
                    className="profile-input"
                  />
                ) : (
                  <p className="profile-value">
                    {user?.dob ? new Date(user.dob).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Not defined'}
                  </p>
                )}
              </div>
            </div>

            <div className="profile-section">
              <h2 className="section-title">Account Information</h2>
              
              <div className="profile-field-row">
                <label>Member Since</label>
                <p className="profile-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>

            {editMode && (
              <div className="profile-actions">
                <button className="save-btn" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            )}
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

export default Dashboard;
