import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Decode token + set axios header
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp < now) {
          logout();
        } else {
          // 🟢 Keep user if already set from login response
          if (!user) setUser(decoded);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
    setLoading(false);
  }, [token]);

  // Login
  const login = async (email, password) => {
    try {
      const res = await axios.post('https://osusu-backend-37us.onrender.com/api/users/login', {
        email,
        password,
      });

      const jwt = res.data.token;
      const loggedInUser = res.data.user; // 🟢 full user object from backend

      localStorage.setItem("token", jwt);
      setToken(jwt);
      setUser(loggedInUser); // 🟢 store actual user with name/email/etc.

      axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

      return { success: true, user: loggedInUser };
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // Signup
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post("https://osusu-backend-37us.onrender.com/api/users/register", {
        name,
        email,
        password,
      });
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Signup failed",
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);