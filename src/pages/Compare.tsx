import React, { useState, useMemo } from 'react';
import { exoplanets, Planet } from '../data/planets';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Footer from '../components/Footer';
import './Compare.css';

// Radar chart component using SVG
const RadarChart: React.FC<{ planet1: Planet; planet2: Planet }> = ({ planet1, planet2 }) => {
    const size = 240;
    const cx = size / 2;
    const cy = size / 2;
    const maxR = size / 2 - 30;
    const metrics = ['Habitability', 'Mass', 'Radius', 'Temperature', 'Distance'];
    const angles = metrics.map((_, i) => (Math.PI * 2 * i) / metrics.length - Math.PI / 2);

    const normalize = (planet: Planet) => {
        const maxDist = Math.max(...exoplanets.map(p => p.distance));
        const maxMass = Math.max(...exoplanets.map(p => p.mass));
        const maxTemp = Math.max(...exoplanets.map(p => p.temperature));
        const maxRad = Math.max(...exoplanets.map(p => p.radius));
        return [
            planet.habitability / 100,
            planet.mass / maxMass,
            planet.radius / maxRad,
            planet.temperature / maxTemp,
            planet.distance / maxDist,
        ];
    };

    const values1 = normalize(planet1);
    const values2 = normalize(planet2);

    const getPoints = (values: number[]) =>
        values.map((v, i) => {
            const r = v * maxR;
            return `${cx + Math.cos(angles[i]) * r},${cy + Math.sin(angles[i]) * r}`;
        }).join(' ');

    return (
        <svg viewBox={`0 0 ${size} ${size}`} className="radar-chart">
            {/* Grid rings */}
            {[0.25, 0.5, 0.75, 1].map(scale => (
                <polygon
                    key={scale}
                    points={angles.map(a => `${cx + Math.cos(a) * maxR * scale},${cy + Math.sin(a) * maxR * scale}`).join(' ')}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1"
                />
            ))}

            {/* Axis lines */}
            {angles.map((a, i) => (
                <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * maxR} y2={cy + Math.sin(a) * maxR}
                    stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            ))}

            {/* Planet 1 polygon */}
            <polygon points={getPoints(values1)} fill="rgba(0, 240, 255, 0.15)" stroke="#00f0ff" strokeWidth="2" />

            {/* Planet 2 polygon */}
            <polygon points={getPoints(values2)} fill="rgba(112, 0, 255, 0.15)" stroke="#7000ff" strokeWidth="2" />

            {/* Axis labels */}
            {metrics.map((label, i) => {
                const labelR = maxR + 18;
                const x = cx + Math.cos(angles[i]) * labelR;
                const y = cy + Math.sin(angles[i]) * labelR;
                return (
                    <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                        className="radar-label">{label}</text>
                );
            })}

            {/* Data points */}
            {values1.map((v, i) => (
                <circle key={`p1-${i}`} cx={cx + Math.cos(angles[i]) * v * maxR} cy={cy + Math.sin(angles[i]) * v * maxR}
                    r="3" fill="#00f0ff" />
            ))}
            {values2.map((v, i) => (
                <circle key={`p2-${i}`} cx={cx + Math.cos(angles[i]) * v * maxR} cy={cy + Math.sin(angles[i]) * v * maxR}
                    r="3" fill="#7000ff" />
            ))}
        </svg>
    );
};

const PlanetSelector: React.FC<{
    selected: Planet;
    onSelect: (p: Planet) => void;
    color: string;
    label: string;
}> = ({ selected, onSelect, color, label }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="planet-selector">
            <span className="selector-label" style={{ color }}>{label}</span>
            <button className="selector-btn" onClick={() => setIsOpen(!isOpen)} style={{ borderColor: color + '40' }}>
                <div className="selector-planet-dot" style={{ background: selected.color }} />
                <span>{selected.name}</span>
                <ChevronDown size={16} className={`selector-chevron ${isOpen ? 'open' : ''}`} />
            </button>
            {isOpen && (
                <motion.div
                    className="selector-dropdown"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {exoplanets.map(p => (
                        <button key={p.id} className={`dropdown-item ${p.id === selected.id ? 'active' : ''}`}
                            onClick={() => { onSelect(p); setIsOpen(false); }}>
                            <div className="selector-planet-dot" style={{ background: p.color }} />
                            <div>
                                <span className="dropdown-name">{p.name}</span>
                                <span className="dropdown-type">{p.type}</span>
                            </div>
                        </button>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

const StatRow: React.FC<{ label: string; v1: string | number; v2: string | number; unit?: string }> = ({ label, v1, v2, unit = '' }) => (
    <div className="compare-stat-row">
        <span className="compare-stat-v1">{v1}{unit}</span>
        <span className="compare-stat-label">{label}</span>
        <span className="compare-stat-v2">{v2}{unit}</span>
    </div>
);

const Compare: React.FC = () => {
    const [planet1, setPlanet1] = useState<Planet>(exoplanets[0]);
    const [planet2, setPlanet2] = useState<Planet>(exoplanets[1]);

    const winner = useMemo(() => {
        const score1 = planet1.habitability;
        const score2 = planet2.habitability;
        if (score1 > score2) return 1;
        if (score2 > score1) return 2;
        return 0;
    }, [planet1, planet2]);

    return (
        <div className="compare-page page-transition">
            <motion.div className="compare-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h1>Planet <span className="gradient-text">Comparison</span></h1>
                <p className="compare-subtitle">Select two exoplanets and compare them side by side across every metric</p>
            </motion.div>

            <div className="compare-selectors">
                <PlanetSelector selected={planet1} onSelect={setPlanet1} color="#00f0ff" label="Planet A" />
                <div className="vs-badge">VS</div>
                <PlanetSelector selected={planet2} onSelect={setPlanet2} color="#7000ff" label="Planet B" />
            </div>

            <div className="compare-content">
                {/* Radar Chart */}
                <motion.div className="radar-container glass-panel"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    key={`${planet1.id}-${planet2.id}`}
                >
                    <h3 className="radar-title">Multivariate Analysis</h3>
                    <RadarChart planet1={planet1} planet2={planet2} />
                    <div className="radar-legend">
                        <span className="radar-legend-item"><span className="legend-color" style={{ background: '#00f0ff' }} />{planet1.name}</span>
                        <span className="radar-legend-item"><span className="legend-color" style={{ background: '#7000ff' }} />{planet2.name}</span>
                    </div>
                </motion.div>

                {/* Stats Comparison */}
                <motion.div className="stats-container glass-panel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    key={`stats-${planet1.id}-${planet2.id}`}
                >
                    <h3 className="stats-title">Head to Head</h3>

                    {winner !== 0 && (
                        <div className="winner-badge">
                            🏆 {winner === 1 ? planet1.name : planet2.name} leads in habitability
                        </div>
                    )}

                    <div className="compare-stats-list">
                        <StatRow label="Habitability" v1={planet1.habitability} v2={planet2.habitability} unit="%" />
                        <StatRow label="Type" v1={planet1.type} v2={planet2.type} />
                        <StatRow label="Mass" v1={planet1.mass} v2={planet2.mass} unit="x Earth" />
                        <StatRow label="Radius" v1={planet1.radius} v2={planet2.radius} unit=" R⊕" />
                        <StatRow label="Temperature" v1={planet1.temperature} v2={planet2.temperature} unit="K" />
                        <StatRow label="Distance" v1={planet1.distance} v2={planet2.distance} unit=" ly" />
                        <StatRow label="Discovered" v1={planet1.discoveryYear} v2={planet2.discoveryYear} />
                        <StatRow label="Atmosphere" v1={planet1.atmosphere.split(',')[0]} v2={planet2.atmosphere.split(',')[0]} />
                    </div>

                    <div className="compare-cta">
                        <Link to={`/simulator?id=${planet1.id}`} className="btn-compare-explore" style={{ borderColor: '#00f0ff40' }}>
                            View {planet1.name.split(' ')[0]} <ArrowRight size={14} />
                        </Link>
                        <Link to={`/simulator?id=${planet2.id}`} className="btn-compare-explore" style={{ borderColor: '#7000ff40' }}>
                            View {planet2.name.split(' ')[0]} <ArrowRight size={14} />
                        </Link>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default Compare;
