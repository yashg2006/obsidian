import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import PlanetCard from '../components/PlanetCard';
import Footer from '../components/Footer';
import CreatePlanetModal from '../components/CreatePlanetModal';
import { motion } from 'framer-motion';
import { Search, Grid3X3, List, SlidersHorizontal, Plus } from 'lucide-react';
import './Explore.css';

type SortKey = 'name' | 'habitability' | 'distance' | 'mass' | 'discoveryYear';

const Explore: React.FC = () => {
    const { allPlanets } = useStore();
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortKey>('habitability');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filtered = useMemo(() => {
        let result = allPlanets.filter(p => {
            const matchesFilter = filter === 'All' || p.type.includes(filter) || (filter === 'Habitable' && p.habitability > 80);
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        result.sort((a, b) => {
            let cmp = 0;
            switch (sortBy) {
                case 'name': cmp = a.name.localeCompare(b.name); break;
                case 'habitability': cmp = a.habitability - b.habitability; break;
                case 'distance': cmp = a.distance - b.distance; break;
                case 'mass': cmp = a.mass - b.mass; break;
                case 'discoveryYear': cmp = a.discoveryYear - b.discoveryYear; break;
            }
            return sortDir === 'desc' ? -cmp : cmp;
        });

        return result;
    }, [allPlanets, filter, searchTerm, sortBy, sortDir]);

    return (
        <div className="explore-page page-transition">
            {/* Animated star background */}
            <div className="star-field">
                {Array.from({ length: 60 }).map((_, i) => (
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
                <div className="header-top-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                    <div>
                        <h1>Explore <span className="gradient-text">Exoplanets</span></h1>
                        <p className="explore-subtitle">
                            Discover real exoplanets from NASA's catalog — each one a potential new world
                        </p>
                    </div>
                    <button className="add-planet-btn" onClick={() => setIsModalOpen(true)}>
                        <Plus size={16} /> Catalog New Planet
                    </button>
                </div>

                <div className="search-bar">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search planets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="explore-controls">
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

                    <div className="sort-controls">
                        <SlidersHorizontal size={14} className="sort-icon" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortKey)}
                            className="sort-select"
                        >
                            <option value="habitability">Habitability</option>
                            <option value="distance">Distance</option>
                            <option value="mass">Mass</option>
                            <option value="name">Name</option>
                            <option value="discoveryYear">Discovery Year</option>
                        </select>
                        <button
                            className="sort-dir-btn"
                            onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
                            title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
                        >
                            {sortDir === 'asc' ? '↑' : '↓'}
                        </button>

                        <div className="view-toggle">
                            <button
                                className={`view-btn-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid3X3 size={14} />
                            </button>
                            <button
                                className={`view-btn-toggle ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="result-count">
                    Showing <span className="count-highlight">{filtered.length}</span> of {allPlanets.length} planets
                </div>
            </motion.div>

            <div className={`planet-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                {filtered.map((planet, index) => (
                    <PlanetCard key={planet.id} planet={planet} index={index} />
                ))}
                {filtered.length === 0 && (
                    <p className="no-results">No planets found matching your criteria.</p>
                )}
            </div>

            <Footer />

            <CreatePlanetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Explore;
