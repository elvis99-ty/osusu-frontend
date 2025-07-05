import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section brand-info">
          <h3>SusuFlow</h3>
          <p>Empowering financial futures through collective saving.</p>
          <div className="social-links">
            <a href="#" className="social-icon"><i className="fab fa-facebook"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-linkedin"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
          </div>
        </div>

        <div className="footer-section navigation-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/register" className="footer-link">Register</Link></li>
            <li><Link to="/login" className="footer-link">Login</Link></li>
            <li><Link to="/dashboard" className="footer-link">Dashboard</Link></li>
          </ul>
        </div>

        <div className="footer-section contact-info">
          <h3>Contact Us</h3>
          <p><i className="fas fa-envelope"></i> info@susuflow.com</p>
          <p><i className="fas fa-phone"></i> +7031053313</p>
          <p><i className="fas fa-map-marker-alt"></i> Lagos, Nigeria</p>
        </div>

        <div className="footer-section newsletter">
          <h3>Newsletter</h3>
          <p>Stay updated with our latest news and features.</p>
          <form className="newsletter-form">
            <input 
              type="email"
              placeholder="Your email address" 
              aria-label="Email for Newsletter" 
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} SusuFlow. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;