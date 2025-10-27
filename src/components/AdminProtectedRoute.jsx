import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  console.log("AdminProtectedRoute check:", {
    isAuthenticated,
    isAdmin: user?.isAdmin,
    user,
    loading
  });

  if (loading) {
    return <div>Loading admin status...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminProtectedRoute;
