import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import { useNavigate, Link  } from 'react-router-dom';
import '../css/Profile.css';
import logo from '../assets/logo.png';
import { FaTachometerAlt, FaExclamationTriangle, FaFolderOpen, FaVideo, FaFileAlt, FaUser, FaCog, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/profile/')
      .then(res => setProfile(res.data))
      .catch(err => {
        setError('Failed to load profile.');
        setTimeout(() => navigate('/signin'), 2000);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
  {/* Header */}
  <div className="header">
    <div className="titles">
      <strong>Biliran Province State University</strong>
      <span className='proctor'> <i> Proctor Dashboard </i></span>
      <span className='subject'> <i> Math 103C </i></span>
    </div>
    <div className="dropdown">
      <img
        src={profile.profile}
        alt="Profile"
        className="profile-img"
        onError={e => e.target.style.display = 'none'}
      />
      <div className="dropdown-content">
        <Link to='/profile'>
          <button><FaUser style={{ marginRight: '8px' }} /> Profile</button>
        </Link>
        <Link to='/settings'>
          <button><FaCog style={{ marginRight: '8px' }} /> Settings</button>
        </Link>
        <Link to='/help'>
          <button><FaQuestionCircle style={{ marginRight: '8px' }} /> Help</button>
        </Link>
        <button onClick={() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          navigate('/signin');
        }}>
          <FaSignOutAlt style={{ marginRight: '8px' }} /> Logout
        </button>
      </div>
    </div>
  </div>

  {/* Content row: sidebar + main content */}
  <div className="profile-container">
    <div className="sidebar">
      <Link to="/dashboard" className='sidebar-logo-item'>
        <img src={logo} alt="Logo" className="sidebar-logo" />
      </Link>
      <div className="sidebar-title">Anti Cheating System</div>
      <div className="sidebar-menu">
        <Link to="/dashboard" className="sidebar-item"><FaTachometerAlt /> Dashboard</Link>
        <Link to="/view-alerts" className="sidebar-item"><FaExclamationTriangle /> Alerts</Link>
        <Link to="/recordings" className="sidebar-item"><FaFolderOpen /> Recordings</Link>
        <Link to="/live-monitoring" className="sidebar-item"><FaVideo /> Live Monitoring</Link>
        <Link to="/reports" className="sidebar-item"><FaFileAlt /> Reports</Link>
      </div>
    </div>
    <div className="main-content">
      <h5>Reports page</h5>
    </div>
  </div>
</>

  );
};

export default Profile;
