import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import Toast from '../components/Toast';
import './ManagementPages.css';

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [selectedRole, setSelectedRole] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setSelectedRole({
      ...selectedRole,
      [userId]: newRole
    });
  };

  const handleUpdateRole = async (userId) => {
    if (!selectedRole[userId]) {
      setToast({ message: 'Please select a role first', type: 'warning' });
      return;
    }

    try {
      await userAPI.updateRole(userId, selectedRole[userId]);
      fetchUsers();
      setEditingId(null);
      setSelectedRole({});
      setToast({ message: 'Role updated successfully', type: 'success' });
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Unable to update role', type: 'error' });
    }
  };

  const handleDeleteUser = (userId) => {
    setDeletingId(userId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await userAPI.delete(deletingId);
      fetchUsers();
      setToast({ message: 'User deleted successfully', type: 'success' });
    } catch (error) {
      setToast({ message: 'Unable to delete user', type: 'error' });
    } finally {
      setShowDeleteConfirm(false);
      setDeletingId(null);
    }
  };

  const matchesUserQuery = (user, q) => {
    const query = (q || '').trim().toLowerCase();
    if (!query) return true;
    const dateStr = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '';
    const dateIso = user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 10) : '';
    const fields = [
      user.name,
      user.email,
      user.mobile,
      user.role,
      dateStr,
      dateIso,
    ];
    return fields.some((f) => f && f.toString().toLowerCase().includes(query));
  };

  const displayUsers = users.filter((u) => matchesUserQuery(u, searchQuery));

  return (
    <div className="management-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {showDeleteConfirm && (
        <div className="confirm-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this user? This will also delete all their bookings.</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn-delete" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
      <div className="page-header">
        <h2>Manage Users</h2>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search users by name, contact address, mobile, role, date"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="header-info">
            Total Users: <strong>{users.length}</strong>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (displayUsers.length === 0 && searchQuery.trim()) ? (
        <div className="empty-state">Nothing found for "{searchQuery}".</div>
      ) : users.length === 0 ? (
        <div className="empty-state">No users found.</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Member Since</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile || '-'}</td>
                  <td>
                    {editingId === user._id ? (
                      <div className="role-edit">
                        <select 
                          value={selectedRole[user._id] || user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                        <button 
                          className="btn-small btn-edit"
                          onClick={() => handleUpdateRole(user._id)}
                          title="Save"
                        >
                          Save
                        </button>
                        <button 
                          className="btn-small btn-cancel btn-cancel-x"
                          onClick={() => {
                            setEditingId(null);
                            setSelectedRole({});
                          }}
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span className={`badge role-${user.role}`}>
                        {user.role === 'super_admin' ? 'Super Admin' : 
                         user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    )}
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    {editingId !== user._id && (
                      <>
                        <button 
                          className="btn-small btn-edit"
                          onClick={() => {
                            setEditingId(user._id);
                            setSelectedRole({ ...selectedRole, [user._id]: user.role });
                          }}
                        >
                          Change Role
                        </button>
                        <button 
                          className="btn-small btn-delete"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UsersManagement;
