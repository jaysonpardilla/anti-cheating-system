import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/SignIn.css'; // import the CSS we'll create
import logo from '../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const SignIn = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login/', {
        username: formData.username,
        password: formData.password
      });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
      setTimeout(() => setError(null), 3000); // hide after 3 seconds
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      {error && <p className="error-text">{error}</p>}
      <div className="left-panel">
      <div className="headers">
        <img src={logo} alt="Logo" className="logo-image" />
        <h1 className="brand-name">Anti-Cheating System</h1>
      </div>

      <div className="welcome-content">
        <h2 className="welcome-text">Welcome Back!</h2>
        <p className="description">
          Sign in to access your proctor dashboard and continue ensuring fair and secure examinations.
        </p>
      </div>
    </div>

      <div className="right-panel">
        <h2 className="form-title">Proctor Sign In</h2>
        {error && <p className="error-text">{error}</p>}
        <form className="signin-form" onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            name="username"
            type="text"
            placeholder="Enter your username"
            onChange={handleChange}
            required
          />
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            onChange={handleChange}
            required
          />
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">remember me</label>
          </div>
          <button type="submit" disabled={loading} className="signin-button">
            {loading ? <FontAwesomeIcon icon={faSpinner} spin className="spinner-icon" /> : 'Sign In'}
          </button>
        </form>
        <p className="signup-text">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
