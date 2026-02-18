import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { NavLink } from 'react-router-dom';
import Globe from '../components/Globe';
import { motion } from 'framer-motion';
import './Landing.css';

// Animated counter component
const Counter: React.FC<{ end: number; label: string; suffix?: string }> = ({ end, label, suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [end]);

    return (
        <div className="stat-counter">
            <span className="stat-number">{count}{suffix}</span>
            <span className="stat-desc">{label}</span>
        </div>
    );
};

const Landing: React.FC = () => {
    return (
        <div className="landing-page">
            {/* Floating orbit rings */}
            <div className="orbit-ring ring-1" />
            <div className="orbit-ring ring-2" />
            <div className="orbit-ring ring-3" />

            {/* Floating mini planet decorations */}
            <div className="floating-dot dot-1" />
            <div className="floating-dot dot-2" />
            <div className="floating-dot dot-3" />
            <div className="floating-dot dot-4" />

            <div className="hero-content">
                <motion.div
                    className="hero-badge"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    🛸 REAL NASA EXOPLANET DATA
                </motion.div>

                <motion.h1
                    className="hero-title"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    EXPLORE THE <span className="highlight-text">UNIVERSE</span>
                </motion.h1>

                <motion.p
                    className="hero-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    Discover real exoplanets, simulate alien environments with interactive 3D visualization, and analyze habitability in real-time.
                </motion.p>

                {/* Stat counters */}
                <motion.div
                    className="hero-stats"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <Counter end={8} label="Exoplanets" />
                    <Counter end={6} label="Habitability Factors" />
                    <Counter end={100} label="Habitability Score" suffix="%" />
                </motion.div>

                <motion.div
                    className="hero-cta"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    <NavLink to="/explore" className="btn-cta">
                        <span>Start Exploration</span>
                        <span className="btn-arrow">→</span>
                    </NavLink>
                    <NavLink to="/simulator" className="btn-secondary">Open Simulator</NavLink>
                </motion.div>
            </div>

            <div className="hero-canvas-container">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <Globe color="#00c8ff" size={2} rotationSpeed={0.003} hasClouds={true} surfaceDetail={0.7} />
                </Canvas>
            </div>

            <div className="scrolldown">
                <div className="mouse"></div>
            </div>
        </div>
    );
};

export default Landing;
