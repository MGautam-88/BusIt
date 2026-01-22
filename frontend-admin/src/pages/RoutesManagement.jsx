//route hatta do jo aaj se purani date ke hain or last route date ke agli date mein laga denge
//ya phir baad mein esa kuch try kare ge route mein koi date nahi hogi , ppar available seats ke liye date hongi???????????/
import { useState, useEffect, useRef } from 'react';
import { routeAPI, busAPI } from '../services/api';
import Toast from '../components/Toast';
import './ManagementPages.css';

// Simple custom dropdown that always opens downward
function DownSelect({ options, value, onChange, placeholder = 'Select', disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className={`custom-select ${open ? 'open' : ''} ${disabled ? 'disabled' : ''}`} ref={ref}>
      <button
        type="button"
        className="select-control"
        onClick={() => !disabled && setOpen((p) => !p)}
        disabled={disabled}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span className="select-arrow">▾</span>
      </button>
      {open && (
        <div className="select-options">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`select-option ${opt.value === value ? 'selected' : ''}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RoutesManagement() {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    bus: '',
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    price: 0,
    date: ''
  });

  // City list for dropdown
  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchRoutes();
    fetchBuses();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await routeAPI.getAll();
      setRoutes(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await busAPI.getAll();
      setBuses(response.data);
    } catch (error) {
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bus || !formData.from || !formData.to || !formData.departureTime || !formData.arrivalTime || !formData.date || !formData.price) {
      showToast('All fields are required to create a route');
      return;
    }
    try {
      if (editingId) {
        await routeAPI.update(editingId, formData);
      } else {
        await routeAPI.create(formData);
      }
      fetchRoutes();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        bus: '',
        from: '',
        to: '',
        departureTime: '',
        arrivalTime: '',
        price: 0,
        date: ''
      });
    } catch (error) {
      showToast(error.response?.data?.message || 'Error saving route');
    }
  };

  const handleEdit = (route) => {
    setFormData({
      bus: route.bus?._id || '',
      from: route.from || route.startLocation || '',
      to: route.to || route.endLocation || '',
      departureTime: route.departureTime || '',
      arrivalTime: route.arrivalTime || '',
      price: route.price || 0,
      date: route.date ? route.date.slice(0, 10) : ''
    });
    setEditingId(route._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await routeAPI.delete(deletingId);
      fetchRoutes();
      showToast('Route deleted successfully', 'success');
    } catch (error) {
      showToast('Unable to delete route', 'error');
    } finally {
      setShowDeleteConfirm(false);
      setDeletingId(null);
    }
  };

  const matchesRouteQuery = (route, q) => {
    const query = (q || '').trim().toLowerCase();
    if (!query) return true;
    const dateStr = route.date ? new Date(route.date).toLocaleDateString() : '';
    const dateIso = route.date ? route.date.slice(0, 10) : '';
    const fields = [
      route.bus?.busName,
      route.bus?.busNumber,
      route.from || route.startLocation,
      route.to || route.endLocation,
      route.departureTime,
      route.arrivalTime,
      String(route.price),
      String(route.availableSeats),
      dateStr,
      dateIso,
    ];
    return fields.some((f) => f && f.toString().toLowerCase().includes(query));
  };

  const displayRoutes = routes.filter((r) => matchesRouteQuery(r, searchQuery)).filter((r) => r.bus);

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
            <p>Are you sure you want to delete this route?</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn-delete" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
      <div className="page-header">
        <h2>Manage Routes</h2>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search routes by city, date, bus name/number, price, seats"
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
                bus: '',
                from: '',
                to: '',
                departureTime: '',
                arrivalTime: '',
                price: 0,
                date: ''
              });
            }
          }}
        >
          {showForm ? 'Cancel' : '+ Add Route'}
        </button>
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit Route' : 'Add New Route'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Bus</label>
                <DownSelect
                  options={buses.map((bus) => ({ value: bus._id, label: `${bus.busName} (${bus.busNumber})` }))}
                  value={formData.bus}
                  onChange={(val) => setFormData({ ...formData, bus: val })}
                  placeholder="Select a bus"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>From</label>
                <DownSelect
                  options={cities.map((city) => ({ value: city, label: city }))}
                  value={formData.from}
                  onChange={(val) => setFormData({ ...formData, from: val })}
                  placeholder="Select City"
                />
              </div>
              <div className="form-group">
                <label>To</label>
                <DownSelect
                  options={cities.map((city) => ({ value: city, label: city }))}
                  value={formData.to}
                  onChange={(val) => setFormData({ ...formData, to: val })}
                  placeholder="Select City"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Departure Time</label>
                <input
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Arrival Time</label>
                <input
                  type="time"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              {editingId ? 'Update Route' : 'Add Route'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading routes...</div>
      ) : (displayRoutes.length === 0 && searchQuery.trim()) ? (
        <div className="empty-state">Nothing found for "{searchQuery}".</div>
      ) : routes.length === 0 ? (
        <div className="empty-state">No routes found. Add your first route!</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bus</th>
                <th>Route</th>
                <th>Departure</th>
                <th>Date</th>
                <th>Price</th>
                <th>Available Seats</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayRoutes.map(route => (
                <tr key={route._id}>
                  <td>{route.bus.busName}</td>
                  <td>{(route.from || route.startLocation || '-')} → {(route.to || route.endLocation || '-')}</td>
                  <td>{route.departureTime}</td>
                  <td>{new Date(route.date).toLocaleDateString()}</td>
                  <td>₹{route.price}</td>
                  <td>{route.availableSeats}</td>
                  <td>
                    <button 
                      className="btn-small btn-edit"
                      onClick={() => handleEdit(route)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-small btn-delete"
                      onClick={() => handleDelete(route._id)}
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

export default RoutesManagement;
