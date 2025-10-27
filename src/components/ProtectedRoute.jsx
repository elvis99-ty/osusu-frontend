import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Path from components to context

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); 

  // Log the current state of isAuthenticated and loading
  console.log(`ProtectedRoute Render: isAuthenticated=${isAuthenticated}, loading=${loading}`);

  // If the authentication status is still being determined, show a loading message
  if (loading) {
    console.log("ProtectedRoute: In loading state. Displaying 'Checking authentication...'");
    return <div className="loading-app-screen">Checking authentication...</div>; 
  }

  // If the user is not authenticated, redirect them to the login page
  if (!isAuthenticated) {
    console.log("ProtectedRoute: Not authenticated. Redirecting to /login.");
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render the child components (the protected content)
  console.log("ProtectedRoute: Authenticated. Rendering children.");
  return children;
};

export default ProtectedRoute;
