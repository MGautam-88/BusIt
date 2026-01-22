import { useState, useEffect } from 'react';
import { busAPI } from '../services/api';
import Toast from '../components/Toast';
import './ManagementPages.css';

function BusesManagement() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    busName: '',
    busNumber: '',
    totalSeats: 40,
    busType: 'AC',
    amenities: []
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await busAPI.getAll();
      setBuses(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'amenities') {
      setFormData({
        ...formData,
        amenities: checked
          ? [...formData.amenities, value]
          : formData.amenities.filter(a => a !== value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await busAPI.update(editingId, formData);
      } else {
        await busAPI.create(formData);
      }
      fetchBuses();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        busName: '',
        busNumber: '',
        totalSeats: 40,
        busType: 'AC',
        amenities: []
      });
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Unable to save bus information', type: 'error' });
    }
  };

  const handleEdit = (bus) => {
    setFormData(bus);
    setEditingId(bus._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await busAPI.delete(deletingId);
      fetchBuses();
      setToast({ message: 'Bus deleted successfully', type: 'success' });
    } catch (error) {
      setToast({ message: 'Unable to delete bus', type: 'error' });
    } finally {
      setShowDeleteConfirm(false);
      setDeletingId(null);
    }
  };

  const matchesBusQuery = (bus, q) => {
    const query = (q || '').trim().toLowerCase();
    if (!query) return true;
    const fields = [
      bus.busName,
      bus.busNumber,
      bus.busType,
      String(bus.totalSeats),
      bus.isActive ? 'active' : 'inactive'
    ];
    return fields.some((f) => f && f.toString().toLowerCase().includes(query));
  };

  const displayBuses = buses.filter((b) => matchesBusQuery(b, searchQuery));

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
            <p>Are you sure you want to delete this bus?</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn-delete" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
      <div className="page-header">
        <h2>Manage Buses</h2>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search buses by name, number, type, seats, status"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        <button 
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingId(null);
              setFormData({
                busName: '',
                busNumber: '',
                totalSeats: 40,
                busType: 'AC',
                amenities: []
              });
            }
          }}
        >
          {showForm ? 'Cancel' : '+ Add Bus'}
        </button>
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit Bus' : 'Add New Bus'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Bus Name</label>
                <input
                  type="text"
                  name="busName"
                  value={formData.busName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Bus Number</label>
                <input
                  type="text"
                  name="busNumber"
                  value={formData.busNumber}
                  onChange={handleInputChange}
                  required
                  disabled={editingId}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Total Seats</label>
                <input
                  type="number"
                  name="totalSeats"
                  value={formData.totalSeats}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Bus Type</label>
                <select
                  name="busType"
                  value={formData.busType}
                  onChange={handleInputChange}
                >
                  <option>AC</option>
                  <option>Non-AC</option>
                  <option>Sleeper</option>
                  <option>Semi-Sleeper</option>
                  <option>Luxury</option>
                  <option>Double-Decker</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Amenities</label>
              <div className="amenities-list">
                {['WiFi', 'USB Charging', 'Blanket', 'Pillow', 'Water Bottle', 'Snacks'].map(amenity => (
                  <label key={amenity} className="checkbox-label">
                    <input
                      type="checkbox"
                      name="amenities"
                      value={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onChange={handleInputChange}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary">
              {editingId ? 'Update Bus' : 'Add Bus'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading buses...</div>
      ) : (displayBuses.length === 0 && searchQuery.trim()) ? (
        <div className="empty-state">Nothing found for "{searchQuery}".</div>
      ) : buses.length === 0 ? (
        <div className="empty-state">No buses found. Add your first bus!</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bus Name</th>
                <th>Bus Number</th>
                <th>Type</th>
                <th>Seats</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayBuses.map(bus => (
                <tr key={bus._id}>
                  <td>{bus.busName}</td>
                  <td>{bus.busNumber}</td>
                  <td>{bus.busType}</td>
                  <td>{bus.totalSeats}</td>
                  <td>
                    <span className={`badge ${bus.isActive ? 'active' : 'inactive'}`}>
                      {bus.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-small btn-edit"
                      onClick={() => handleEdit(bus)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-small btn-delete"
                      onClick={() => handleDelete(bus._id)}
                    >
                      Delete
                    </button>
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

export default BusesManagement;
