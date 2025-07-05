import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
let REACT_APP_API_URL = import.meta.env.VITE_API_URL

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await axios.get(`${REACT_APP_API_URL}/users/profile`);
          setUser(response.data);
        } catch (error) {
          console.error('Token validation failed during profile fetch:', error.response?.data || error.message);
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      } else {
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return <div className="loading-app-screen">Loading application...</div>;
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);