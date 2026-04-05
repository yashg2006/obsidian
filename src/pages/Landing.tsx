import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { NavLink } from 'react-router-dom';
import Globe from '../components/Globe';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Telescope, Globe2, BarChart3, Shield, ArrowRight, Star, Sparkles } from 'lucide-react';
import { exoplanets } from '../data/planets';
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

// Typewriter effect
const TypewriterText: React.FC<{ texts: string[] }> = ({ texts }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentText = texts[currentIndex];
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                setDisplayText(currentText.substring(0, displayText.length + 1));
                if (displayText.length === currentText.length) {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                setDisplayText(currentText.substring(0, displayText.length - 1));
                if (displayText.length === 0) {
                    setIsDeleting(false);
                    setCurrentIndex((prev) => (prev + 1) % texts.length);
                }
            }
        }, isDeleting ? 30 : 60);
        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentIndex, texts]);

    return <span className="typewriter">{displayText}<span className="cursor">|</span></span>;
};

// Constellation Canvas
const ConstellationBg: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight * 3;
        };
        resize();
        window.addEventListener('resize', resize);

        const stars: { x: number; y: number; size: number; opacity: number; speed: number }[] = [];
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                speed: Math.random() * 0.5 + 0.1,
            });
        }

        let animId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const time = Date.now() * 0.001;

            stars.forEach((star, i) => {
                const twinkle = Math.sin(time * star.speed + i) * 0.3 + 0.7;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
                ctx.fill();
            });

            // Draw subtle connections
            for (let i = 0; i < stars.length; i++) {
                for (let j = i + 1; j < stars.length; j++) {
                    const dx = stars[i].x - stars[j].x;
                    const dy = stars[i].y - stars[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(stars[i].x, stars[i].y);
                        ctx.lineTo(stars[j].x, stars[j].y);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${0.03 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="constellation-canvas" />;
};

const features = [
    { icon: <Telescope size={28} />, title: 'Real NASA Data', desc: 'Browse confirmed exoplanets from NASA\'s catalog with verified scientific data.' },
    { icon: <Globe2 size={28} />, title: '3D Visualization', desc: 'Interactive procedural planet rendering with GLSL shaders and real-time controls.' },
    { icon: <BarChart3 size={28} />, title: 'Habitability Analysis', desc: 'Score planets across 6 key factors including temperature, atmosphere, and water.' },
    { icon: <Shield size={28} />, title: 'Planet Simulator', desc: 'Create custom worlds by adjusting stellar classification, orbital distance, and more.' },
];

const Landing: React.FC = () => {
    const topPlanets = [...exoplanets].sort((a, b) => b.habitability - a.habitability).slice(0, 4);

    return (
        <div className="landing-page">
            <ConstellationBg />

            {/* ═══════ HERO SECTION ═══════ */}
            <section className="hero-section">
                {/* Floating orbit rings */}
                <div className="orbit-ring ring-1" />
                <div className="orbit-ring ring-2" />
                <div className="orbit-ring ring-3" />

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
                        <Sparkles size={14} /> REAL NASA EXOPLANET DATA
                    </motion.div>

                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        EXPLORE THE <span className="gradient-text">UNIVERSE</span>
                    </motion.h1>

                    <motion.div
                        className="hero-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <TypewriterText texts={[
                            'Discover real exoplanets from NASA\'s catalog...',
                            'Simulate alien environments in real-time...',
                            'Analyze habitability with 3D visualization...',
                            'Compare worlds across the galaxy...',
                        ]} />
                    </motion.div>

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
                            <ArrowRight size={16} className="btn-arrow" />
                        </NavLink>
                        <NavLink to="/simulator" className="btn-secondary">Open Simulator</NavLink>
                    </motion.div>
                </div>

                <div className="hero-canvas-container">
                    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                        <Globe
                            color="#00c8ff"
                            size={2}
                            rotationSpeed={0.003}
                            hasClouds={true}
                            surfaceWater={0.7}
                            temperature={288}
                            atmosphereDensity={1.0}
                        />
                    </Canvas>
                </div>

                <div className="scrolldown">
                    <div className="mouse"></div>
                    <span className="scroll-text">Scroll to explore</span>
                </div>
            </section>

            {/* ═══════ FEATURES SECTION ═══════ */}
            <section className="features-section page-section">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">
                        Why <span className="gradient-text">COSMOS</span>?
                    </h2>
                    <p className="section-subtitle">
                        A next-generation exoplanet explorer built with cutting-edge web technology and real scientific data.
                    </p>
                </motion.div>

                <div className="features-grid">
                    {features.map((feat, i) => (
                        <motion.div
                            key={feat.title}
                            className="feature-card glass-panel"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ y: -6, scale: 1.02 }}
                        >
                            <div className="feature-icon">{feat.icon}</div>
                            <h3 className="feature-title">{feat.title}</h3>
                            <p className="feature-desc">{feat.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══════ PLANET HIGHLIGHTS ═══════ */}
            <section className="highlights-section page-section">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">
                        <Star size={24} className="inline-icon" /> Most Habitable Worlds
                    </h2>
                    <p className="section-subtitle">
                        The top-ranked exoplanets by our habitability algorithm — could these be humanity's next home?
                    </p>
                </motion.div>

                <div className="highlights-scroll">
                    {topPlanets.map((planet, i) => (
                        <motion.div
                            key={planet.id}
                            className="highlight-card"
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                            whileHover={{ y: -8 }}
                        >
                            <div
                                className="highlight-planet-orb"
                                style={{ background: `radial-gradient(circle at 30% 30%, ${planet.color}88, ${planet.color})` }}
                            />
                            <div className="highlight-info">
                                <span className="highlight-rank">#{i + 1}</span>
                                <h3>{planet.name}</h3>
                                <span className="highlight-type">{planet.type}</span>
                                <div className="highlight-score">
                                    <div className="highlight-bar-bg">
                                        <motion.div
                                            className="highlight-bar-fill"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${planet.habitability}%` }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.15 + 0.3, duration: 1 }}
                                        />
                                    </div>
                                    <span className="highlight-percent">{planet.habitability}%</span>
                                </div>
                                <NavLink to={`/simulator?id=${planet.id}`} className="highlight-link">
                                    View in 3D <ArrowRight size={14} />
                                </NavLink>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══════ CTA SECTION ═══════ */}
            <section className="cta-section page-section">
                <motion.div
                    className="cta-card glass-panel-strong"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Ready to explore the cosmos?</h2>
                    <p>Dive into our interactive star map, compare worlds side by side, or simulate your own planet.</p>
                    <div className="cta-buttons">
                        <NavLink to="/starmap" className="btn-cta">
                            <span>Open Star Map</span>
                            <ArrowRight size={16} />
                        </NavLink>
                        <NavLink to="/compare" className="btn-secondary">Compare Planets</NavLink>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
};

export default Landing;
