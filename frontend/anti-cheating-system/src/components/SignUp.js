import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import '../css/SignUp.css';
import logo from '../assets/logo.png';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 3000); // hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreeTerms || !consent) {
      setError('Please agree to the terms and consent.');
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post('/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      setMessage('Registration successful. Redirecting to login...');
      setTimeout(() => navigate('/signin'), 2000);
    } catch (err) {
      const data = err.response?.data || {};
      if (data.username) {
        setError(data.username[0]);
      } else if (data.email) {
        setError(data.email[0]);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Top center message */}
      {message && <div className="top-message success">{message}</div>}
      {error && <div className="top-message error">{error}</div>}

      <div className="left-panel">
        <div className="headers">
          <img src={logo} alt="Logo" className="logo-image" />
          <h1 className="brand-name">Anti-Cheating System</h1>
        </div>
        <div className="welcome-content">
          <h2 className="welcome-text">Secure Exam Monitoring</h2>
          <p className="description">
            Join our platform to monitor exams in real-time using AI-based anti-cheating technologies.
            Maintain academic integrity effortlessly.
          </p>
        </div>
      </div>

      <div className="right-panel">
        <h2>Proctor Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type='text'
            placeholder="Username"
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
              />{' '}
              I agree to the_  <Link to="/terms">  Terms of Services</Link>
            </label>
            <label>
              <input
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
              />{' '}
              I consent to monitoring and understand the data policy.
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Sign up'}
          </button>
        </form>

        <p className="signin-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
