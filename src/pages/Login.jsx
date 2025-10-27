// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const isFormValid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
        password.length >= 6;

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        const success = await login(email, password);
        if (success) {
            setSuccessMessage(`🎉 Welcome back, ${user?.name || 'User'}! Redirecting...`);
            setErrorMessage('');
        } else {
            setErrorMessage('Invalid email or password. Please try again.');
            setSuccessMessage('');
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            // Delay a little so successMessage shows before redirect
            setTimeout(() => navigate('/dashboard'), 1500);
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        setErrorMessage('');
        setSuccessMessage('');
    }, [email, password]);

    return (
        <div className="register-container p-8 bg-gray-200 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Login</h2>
            <form onSubmit={handleSubmit} className="register-form space-y-4">
                {/* Email */}
                <div className="form-group">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                        <small className="error-text text-red-500">Enter a valid email address</small>
                    )}
                </div>

                {/* Password */}
                <div className="form-group password-group relative">
                    <label className="block text-gray-700">Password</label>
                    <div className="password-wrapper relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md pr-10"
                        />
                        <span
                            onClick={togglePasswordVisibility}
                            className="eye-icon absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </span>
                    </div>
                    {password && password.length < 6 && (
                        <small className="error-text text-red-500">Password must be at least 6 characters</small>
                    )}
                </div>

                <button
                    type="submit"
                    className="submit-btn w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                    disabled={!isFormValid}
                >
                    Login
                </button>

                {successMessage && <div className="success-text mt-4 text-green-500">{successMessage}</div>}
                {errorMessage && <div className="error-text mt-4 text-red-500">{errorMessage}</div>}
            </form>

            <div className="login-redirect mt-4 text-center">
                <p className="text-gray-700">
                    Don't have an account?{' '}
                    <Link to="/register" className="login-link text-blue-500 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;