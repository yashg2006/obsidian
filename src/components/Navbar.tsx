import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket, User, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import './Navbar.css';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAuthenticated, logout } = useStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/explore', label: 'Explore' },
        { path: '/simulator', label: 'Simulator' },
        ...(isAuthenticated ? [{ path: '/my-planets', label: 'My Planets' }] : []),
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <NavLink to="/" className="navbar-logo">
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
                                {link.label}
                            </NavLink>
                        </li>
                    ))}

                    <li className="nav-item auth-item">
                        {isAuthenticated ? (
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
