import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const renderNavLinks = () => {
    if (location.pathname === '/login') {
      return (
        <div className="nav-links">
          <NavLink to="/login" className="nav-link">Login</NavLink>
        </div>
      );
    } else if (location.pathname === '/register') {
      return (
        <div className="nav-links">
          <NavLink to="/register" className="nav-link">Register</NavLink>
        </div>
      );
    } else if (isAuthenticated) {
    } else {
      return (
        <div className="nav-links">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/register" className="nav-link">Register</NavLink>
          <NavLink to="/login" className="nav-link">Login</NavLink>
        </div>
      );
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to={isAuthenticated ? "/dashboard" : "/"} className="nav-logo-link">SusuFlow</NavLink>
      </div>
      {renderNavLinks()}
    </nav>
  );
};

export default Navbar;