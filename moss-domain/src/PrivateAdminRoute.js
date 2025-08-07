// src/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ✅ correct import

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');

  // If no token → send to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // If no role or not admin → send to unauthorized page or home
    if (!decoded.role || decoded.role.toLowerCase() !== 'admin') {
      return <Navigate to="/unauthorized" replace />;
    }

    // Role is admin → allow through
    return element;
  } catch (err) {
    console.error('Invalid token:', err);
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
