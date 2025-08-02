// src/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');

  // If there is no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If there is a token, render the component passed in `element`
  return element;
};

export default PrivateRoute;
