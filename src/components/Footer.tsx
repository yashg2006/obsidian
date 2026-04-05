import React from 'react';
import { NavLink } from 'react-router-dom';
import { Rocket, Github, Twitter, Globe, Heart } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-glow" />
            <div className="footer-content">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <Rocket size={20} />
                            <span>COSMOS</span>
                        </div>
                        <p className="footer-tagline">
                            Exploring the universe, one exoplanet at a time. Powered by real NASA data.
                        </p>
                        <div className="footer-socials">
                            <a href="#" className="social-link" aria-label="GitHub"><Github size={18} /></a>
                            <a href="#" className="social-link" aria-label="Twitter"><Twitter size={18} /></a>
                            <a href="#" className="social-link" aria-label="Website"><Globe size={18} /></a>
                        </div>
                    </div>

                    <div className="footer-links-group">
                        <h4>Explore</h4>
                        <NavLink to="/explore">Exoplanets</NavLink>
                        <NavLink to="/simulator">Simulator</NavLink>
                        <NavLink to="/starmap">Star Map</NavLink>
                        <NavLink to="/compare">Compare</NavLink>
                    </div>

                    <div className="footer-links-group">
                        <h4>Resources</h4>
                        <a href="https://exoplanetarchive.ipac.caltech.edu/" target="_blank" rel="noreferrer">NASA Archive</a>
                        <a href="https://www.nasa.gov/exoplanets" target="_blank" rel="noreferrer">NASA Exoplanets</a>
                        <a href="https://eyes.nasa.gov" target="_blank" rel="noreferrer">NASA Eyes</a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>
                        Built with <Heart size={12} className="heart-icon" /> using React, Three.js & NASA Open Data
                    </p>
                    <p className="footer-year">© {new Date().getFullYear()} COSMOS Explorer</p>
                </div>
            </div>

            {/* Decorative stars */}
            {Array.from({ length: 20 }).map((_, i) => (
                <div
                    key={i}
                    className="footer-star"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                />
            ))}
        </footer>
    );
};

export default Footer;
