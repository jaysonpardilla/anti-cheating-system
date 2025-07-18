import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import ViewAlert from './components/view-alerts';
import PrivateRoute from './components/PrivateRoute';
import UpdateProfile from './components/UpdateProfile';
import Profile from './components/profile';
import Reports from './components/Reports'
import Recordings from './components/Recordings'
import LiveMonitoring from './components/LiveMonitoring'
import ContactPage from './components/help';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        
        {/* Private routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/view-alerts"
          element={
            <PrivateRoute>
              <ViewAlert />
            </PrivateRoute>
          }
        />
        <Route
          path="/live-monitoring"
          element={
            <PrivateRoute>
              <LiveMonitoring />
            </PrivateRoute>
          }
        />
        <Route
          path="/recordings"
          element={
            <PrivateRoute>
              <Recordings />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />
        <Route
          path="/update-profile"
          element={
            <PrivateRoute>
              <UpdateProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/help"
          element={
            <PrivateRoute>
              <ContactPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
