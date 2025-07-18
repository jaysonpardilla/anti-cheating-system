import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import logo from '../assets/logo.png';
import { 
  FaTachometerAlt, FaExclamationTriangle, FaFolderOpen, FaVideo, 
  FaFileAlt, FaUser, FaCog, FaQuestionCircle, FaSignOutAlt 
} from 'react-icons/fa';
import '../css/Help.css';

const Help = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Load profile data when component mounts
  useEffect(() => {
    axiosInstance.get('/profile/')
      .then(res => setProfile(res.data))
      .catch(err => {
        console.error('Failed to load profile:', err);
        setProfileError('Failed to load profile.');
        // Redirect to signin after short delay
        setTimeout(() => navigate('/signin'), 1500);
      });
  }, [navigate]);

  // Add this new effect
  useEffect(() => {
    if (success !== null) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // const faqs = [
  //   { id: 1, question: "What is this system about?", answer: "This system helps monitor exams to prevent cheating." },
  //   { id: 2, question: "How do I reset my password?", answer: "Go to settings and click 'Reset Password'." },
  //   { id: 3, question: "Can I download reports?", answer: "Yes, you can download reports in PDF format." },
  //   { id: 4, question: "Who do I contact for support?", answer: "Please use the contact form to send us a message." },
  //   { id: 5, question: "Is my data secure?", answer: "Yes, we use encryption and secure protocols." },
  //   { id: 6, question: "Can students see the dashboard?", answer: "No, only proctors have access to the dashboard." },
  // ];

  const faqs = [
    { id: 1, question: "What is this system about?", answer: "This system helps monitor exams to prevent cheating." },
    { id: 2, question: "How do I reset my password?", answer: "Go to settings and click 'Reset Password'." },
    { id: 3, question: "Can I download reports?", answer: "Yes, you can download reports in PDF format." },
    { id: 4, question: "Who do I contact for support?", answer: "Please use the contact form to send us a message." },
    { id: 5, question: "Is my data secure?", answer: "Yes, we use encryption and secure protocols." },
    { id: 6, question: "Can students see the dashboard?", answer: "No, only proctors have access to the dashboard." },

    // New cheating detection related FAQs:
    { id: 7, question: "How does the system detect cheating?", answer: "The system uses AI to analyze head, shoulder, and body movements, and detects suspicious objects in real time." },
    { id: 8, question: "Does the system track students' eyes?", answer: "No, the system currently focuses on larger body movements and objects, not eye tracking." }
];

  const handleFaqClick = (id) => {
    setExpandedFaq(prevId => (prevId === id ? null : id));
  };

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError('');

    try {
      const res = await axiosInstance.post('/send/', formData);
      if (res.data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSuccess(false);
        setError(res.data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setSuccess(false);
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="header">
        <div className="titles">
          <strong>Biliran Province State University</strong>
          <span className='proctor'><i> Proctor Dashboard </i></span>
          <span className='subject'><i> Math 103C </i></span>
        </div>
        <div className="dropdown">
          <img
            src={profile?.profile || 'https://via.placeholder.com/40'}
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

      {/* Sidebar + Main content */}
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
          <section className="contact-section">
            <h2>Connect with our Team</h2>
            <div className="contact-body">
              <div className="faq-list">
                <h3>Frequently Asked Questions</h3>
                {faqs.map(faq => (
                  <div
                    key={faq.id}
                    className={`faq-item ${expandedFaq === faq.id ? 'expanded' : ''}`}
                    onClick={() => handleFaqClick(faq.id)}
                  >
                    <div className="faq-question">{faq.question}</div>
                    {expandedFaq === faq.id && (
                      <div className="faq-answer">{faq.answer}</div>
                    )}
                  </div>
                ))}
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>
                <h3>Get in touch with us</h3>
                <div className="form-row">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="message"
                  placeholder="Message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
                <button type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
                {success === true && <p className="success-text">Message sent successfully!</p>}
                {success === false && <p className="error-text">{error}</p>}
              </form>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Help;
