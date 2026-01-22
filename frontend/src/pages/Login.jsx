import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';

function Login({ setToken }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/home';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await authAPI.login(formData);
      setToken(response.data.token);
      navigate(redirectUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('auth-modal-backdrop')) {
      handleClose();
    }
  };

  return (
    <div className="auth-modal-backdrop" onClick={handleBackdropClick}>
      <div className="auth-modal-container">
        <button className="auth-modal-close" onClick={handleClose}>×</button>
        <h2>Login to get exciting offers</h2>
        {error && <div className="error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button type="submit" className="auth-submit-btn">Login</button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
