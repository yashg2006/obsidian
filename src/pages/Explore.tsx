import React, { useState } from 'react';
import { exoplanets } from '../data/planets';
import PlanetCard from '../components/PlanetCard';
import { motion } from 'framer-motion';
import './Explore.css';

const Explore: React.FC = () => {
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = exoplanets.filter(p => {
        const matchesFilter = filter === 'All' || p.type.includes(filter) || (filter === 'Habitable' && p.habitability > 80);
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="explore-page">
            {/* Animated star background */}
            <div className="star-field">
                {Array.from({ length: 50 }).map((_, i) => (
                    <div
                        key={i}
                        className="star-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                            width: `${1 + Math.random() * 2}px`,
                            height: `${1 + Math.random() * 2}px`,
                        }}
                    />
                ))}
            </div>

            <motion.div
                className="explore-header"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>Explore Exoplanets</h1>
                <p className="explore-subtitle">
                    Discover real exoplanets from NASA's catalog — each one a potential new world
                </p>

                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search planets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filters">
                    {['All', 'Terrestrial', 'Super-Earth', 'Habitable'].map(f => (
                        <button
                            key={f}
                            className={`filter-btn ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="result-count">
                    Showing <span className="count-highlight">{filtered.length}</span> of {exoplanets.length} planets
                </div>
            </motion.div>

            <div className="planet-grid">
                {filtered.map((planet, index) => (
                    <PlanetCard key={planet.id} planet={planet} index={index} />
                ))}
                {filtered.length === 0 && (
                    <p className="no-results">No planets found matching your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default Explore;
