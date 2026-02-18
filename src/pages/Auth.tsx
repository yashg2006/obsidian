import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import './Auth.css';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setLoading(true);
        setError('');

        const endpoint = isLogin ? 'http://localhost:3000/api/auth/login' : 'http://localhost:3000/api/auth/register';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name: email.split('@')[0] })
            });

            const data = await res.json();

            if (res.ok) {
                login(data.user.email, data.token, data.user);
                navigate('/my-planets');
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Server error. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <motion.div
                className="auth-container glass-panel"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`auth-tab ${!isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Join the Mission'}</h2>

                {error && <div className="auth-error" style={{ color: '#ff0055', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="explorer@cosmos.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Launch' : 'Register')}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Secure Access | Cosmos Backend</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
