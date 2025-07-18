import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Profile.css';
import logo from '../assets/logo.png';
import {
  FaExclamationTriangle, FaTachometerAlt,FaFolderOpen, FaVideo, FaFileAlt,
  FaEdit, FaUser, FaCog, FaQuestionCircle, FaSignOutAlt
} from 'react-icons/fa';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    phone_number: '',
    institution: '',
    subject_exam: '',
    role: '',
    fullname: '',
    profile: null
  });

  const [profile, setProfile] = useState(null);  // to reuse existing data like username/email
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/profile/')
      .then(res => {
        setFormData(prev => ({
          ...prev,
          ...res.data
        }));
        setProfile(res.data);
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'profile') {
      setFormData({ ...formData, profile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    if (formData.phone_number) data.append('phone_number', formData.phone_number);
    if (formData.institution) data.append('institution', formData.institution);
    if (formData.subject_exam) data.append('subject_exam', formData.subject_exam);
    if (formData.role) data.append('role', formData.role);
    if (formData.fullname) data.append('fullname', formData.fullname);
    if (formData.profile instanceof File) data.append('profile', formData.profile);

    try {
      await axiosInstance.patch('/profile/update/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/profile');
    } catch (err) {
      console.error(err);
      setError('Failed to update profile');
    }
  };

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
          <img src={logo} alt="Logo" className="sidebar-logo" />
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
          <div className="profile-card">
            <h2>Update Your Profile</h2>
            <form onSubmit={handleSubmit} className="update-form">
              <input
                type="text"
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number || ''}
                onChange={handleChange}
              /><br />
              <input
                type="text"
                name="institution"
                placeholder="Institution"
                value={formData.institution || ''}
                onChange={handleChange}
              /><br />
              <input
                type="text"
                name="subject_exam"
                placeholder="Subject Exam"
                value={formData.subject_exam || ''}
                onChange={handleChange}
              /><br />
              <input
                type="text"
                name="role"
                placeholder="Role"
                value={formData.role || ''}
                onChange={handleChange}
              /><br />
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname || ''}
                onChange={handleChange}
              /><br />
              <input
                type="file"
                name="profile"
                accept="image/*"
                onChange={handleChange}
              /><br />
              <button type="submit" className="update-btn">
                <FaEdit /> Save Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
