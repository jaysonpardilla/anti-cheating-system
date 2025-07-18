import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
const token = localStorage.getItem('access_token'); // ✅ match the key used in SignIn
  return token ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
