import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
let REACT_APP_API_URL = import.meta.env.VITE_API_URL


const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    accountNumber: '',
    bankName: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post(`${REACT_APP_API_URL}/users/register`, formData);
      setMessage(response.data.message + " You can now login.");
      setFormData({ // Clear form on successful registration
        name: '',
        email: '',
        password: '',
        phone: '',
        accountNumber: '',
        bankName: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel" // Changed to type="tel" for phone numbers
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              placeholder="Enter your bank account number"
              value={formData.accountNumber}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              placeholder="Enter your bank name"
              value={formData.bankName}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit">Register</button>
        </form>
        <p className="auth-switch-text">Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
};

export default Register;