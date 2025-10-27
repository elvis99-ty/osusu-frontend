import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const isFormValid =
        name.trim().length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
        password.length >= 6 &&
        password === confirmPassword;

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        try {
            const response = await axios.post('https://osusu-backend-37us.onrender.com/api/users/register', {
                name, 
                email,
                password,
                password2: confirmPassword,
            });

            if (response.status === 201) {
                setSuccessMessage('🎉 Registration successful! Redirecting to login...');
                setErrorMessage('');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error);
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            setErrorMessage(message);
            setSuccessMessage('');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>

            <form onSubmit={handleSubmit} className="register-form">
                {/* Name */}
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    {name && name.trim().length < 2 && (
                        <small className="error-text">Name must be at least 2 characters</small>
                    )}
                </div>

                {/* Email */}
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                        <small className="error-text">Enter a valid email address</small>
                    )}
                </div>

                {/* Password */}
                <div className="form-group password-group">
                    <label>Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span onClick={togglePasswordVisibility} className="eye-icon">
                            {showPassword ? '🙈' : '👁️'}
                        </span>
                    </div>
                    {password && password.length < 6 && (
                        <small className="error-text">Password must be at least 6 characters</small>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="form-group password-group">
                    <label>Confirm Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onCopy={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            onPaste={(e) => e.preventDefault()}
                            required
                        />
                        <span onClick={togglePasswordVisibility} className="eye-icon">
                            {showPassword ? '🙈' : '👁️'}
                        </span>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                        <small className="error-text">Passwords do not match</small>
                    )}
                </div>

                <button type="submit" className="submit-btn" disabled={!isFormValid}>
                    Register
                </button>

                {successMessage && <div className="success-text">{successMessage}</div>}
                {errorMessage && <div className="error-text">{errorMessage}</div>}
            </form>

            <div className="login-redirect">
                <p>Already have an account? <Link to="/login" className="login-link">Login here</Link></p>
            </div>
        </div>
    );
};

export default Register;