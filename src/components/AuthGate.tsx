import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Rocket, LogIn, Zap, Globe2, BarChart3, Sparkles } from 'lucide-react';
import './AuthGate.css';

const AuthGate: React.FC = () => {
    const { loginAsGuest } = useStore();
    const navigate = useNavigate();

    // Procedural starfield
    const stars = useMemo(() => {
        return Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: Math.random() * 2.5 + 0.5,
            delay: `${Math.random() * 3}s`,
        }));
    }, []);

    const handleTryFree = () => {
        loginAsGuest();
        navigate('/explore');
    };

    const handleSignIn = () => {
        navigate('/auth');
    };

    return (
        <div className="auth-gate">
            {/* Starfield */}
            <div className="auth-gate-stars">
                {stars.map((s) => (
                    <span
                        key={s.id}
                        style={{
                            left: s.left,
                            top: s.top,
                            width: s.size,
                            height: s.size,
                            animationDelay: s.delay,
                        }}
                    />
                ))}
            </div>

            {/* Orbit rings */}
            <div className="gate-orbit gate-orbit-1" />
            <div className="gate-orbit gate-orbit-2" />
            <div className="gate-orbit gate-orbit-3" />

            {/* Nebula glow */}
            <div className="gate-nebula" />
            <div className="gate-nebula gate-nebula-2" />

            {/* Card */}
            <div className="auth-gate-card">
                <div className="gate-logo">
                    <div className="gate-logo-icon">
                        <Rocket size={24} />
                    </div>
                    <span className="gate-logo-text">COSMOS</span>
                </div>
                <div className="gate-tagline">Exoplanet Explorer</div>

                <h1 className="gate-heading">
                    Discover Worlds Beyond<br />Our Solar System
                </h1>
                <p className="gate-subtext">
                    Explore real NASA exoplanet data, simulate alien worlds in 3D,
                    and analyze habitability — all in your browser.
                </p>

                <div className="gate-buttons">
                    <button className="gate-btn gate-btn-primary" onClick={handleSignIn}>
                        <span className="gate-btn-icon"><LogIn size={18} /></span>
                        Sign In / Sign Up
                    </button>

                    <div className="gate-divider"><span>or</span></div>

                    <button className="gate-btn gate-btn-secondary" onClick={handleTryFree}>
                        <span className="gate-btn-icon"><Zap size={18} /></span>
                        Try for Free — No Account Needed
                    </button>
                </div>

                <div className="gate-features">
                    <span className="gate-feature"><Globe2 size={14} /> 3D Planets</span>
                    <span className="gate-feature"><BarChart3 size={14} /> Analysis</span>
                    <span className="gate-feature"><Sparkles size={14} /> All Features</span>
                </div>
            </div>
        </div>
    );
};

export default AuthGate;
