import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket, User, LogOut, Map, GitCompare, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import './Navbar.css';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, isAuthenticated, isGuest, logout } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/explore', label: 'Explore' },
        { path: '/simulator', label: 'Simulator' },
        { path: '/starmap', label: 'Star Map', icon: <Map size={14} /> },
        { path: '/compare', label: 'Compare', icon: <GitCompare size={14} /> },
        { path: '/my-planets', label: 'My Planets' },
    ];

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <NavLink to="/" className="navbar-logo">
                    <div className="logo-glow" />
                    <Rocket className="logo-icon" />
                    <span className="logo-text">COSMOS</span>
                </NavLink>

                <div className="mobile-icon" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </div>

                <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
                    {navLinks.map((link) => (
                        <li key={link.path} className="nav-item">
                            <NavLink
                                to={link.path}
                                className={({ isActive }) => isActive ? 'nav-links active' : 'nav-links'}
                                onClick={() => setIsOpen(false)}
                            >
                                {'icon' in link && link.icon}
                                {link.label}
                            </NavLink>
                        </li>
                    ))}

                    <li className="nav-item auth-item">
                        {isGuest ? (
                            <div className="user-menu">
                                <span className="user-name guest-badge"><Zap size={14} /> Guest</span>
                                <NavLink
                                    to="/auth"
                                    className="btn-login"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign In
                                </NavLink>
                                <button onClick={handleLogout} className="btn-logout"><LogOut size={16} /></button>
                            </div>
                        ) : isAuthenticated ? (
                            <div className="user-menu">
                                <span className="user-name"><User size={16} /> {user?.name}</span>
                                <button onClick={handleLogout} className="btn-logout"><LogOut size={16} /></button>
                            </div>
                        ) : (
                            <NavLink
                                to="/auth"
                                className="btn-login"
                                onClick={() => setIsOpen(false)}
                            >
                                Login
                            </NavLink>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
