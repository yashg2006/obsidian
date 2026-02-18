import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import './Controls.css';

const Controls: React.FC = () => {
    const { simulatorParams, updateSimulatorParams, savePlanet, user } = useStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateSimulatorParams({ [name]: name === 'starType' ? value : parseFloat(value) });
    };

    // Advanced 6-factor scoring
    const scoring = useMemo(() => {
        const { distance, planetRadius, atmosphereDensity, surfaceWater, magneticField } = simulatorParams;

        // 1. Distance score (Ideal 1.0 AU)
        const distScore = Math.max(0, 100 - Math.abs(distance - 1.0) * 80);

        // 2. Size score (Ideal 1.0 Earths)
        const sizeScore = Math.max(0, 100 - Math.abs(planetRadius - 1.0) * 100);

        // 3. Atmosphere score (Ideal 1.0 Density)
        const atmScore = Math.max(0, 100 - Math.abs(atmosphereDensity - 1.0) * 50);

        // 4. Water score (Ideal 0.7)
        const waterScore = Math.max(0, 100 - Math.abs(surfaceWater - 0.7) * 150);

        // 5. Magnetic score (Ideal 1.0)
        const magScore = magneticField * 100;

        // 6. Temperature (Derived from distance & star - simplified for UI)
        const tempScore = Math.max(0, 100 - Math.abs(distance - 0.9) * 120);

        const total = Math.round((distScore + sizeScore + atmScore + waterScore + magScore + tempScore) / 6);

        return {
            total,
            factors: [
                { label: 'Orbital Distance', value: distScore, color: '#00f0ff' },
                { label: 'Planet Mass/Size', value: sizeScore, color: '#7000ff' },
                { label: 'Atmosphere Density', value: atmScore, color: '#ffaa00' },
                { label: 'Liquid Water', value: waterScore, color: '#00ff88' },
                { label: 'Magnetic Shield', value: magScore, color: '#ff0055' },
                { label: 'Surface Temperature', value: tempScore, color: '#ff6600' }
            ]
        };
    }, [simulatorParams]);

    const { total, factors } = scoring;

    // SVG ring calculations
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (total / 100) * circumference;

    return (
        <motion.div
            className="controls-panel glass-panel"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="controls-title">System Analysis</h2>

            <div className="control-section">
                <h3>Primary Star</h3>
                <div className="control-group">
                    <label>Stellar Classification</label>
                    <select name="starType" value={simulatorParams.starType} onChange={handleChange}>
                        <option value="O">O - Blue Giant (Extreme)</option>
                        <option value="B">B - Blue-White</option>
                        <option value="A">A - White</option>
                        <option value="F">F - Yellow-White</option>
                        <option value="G">G - Yellow Dwarf (Sun-like)</option>
                        <option value="K">K - Orange Dwarf</option>
                        <option value="M">M - Red Dwarf</option>
                    </select>
                </div>

                <div className="control-group">
                    <label>Orbital Distance: {simulatorParams.distance} AU</label>
                    <input type="range" name="distance" min="0.1" max="5" step="0.1" value={simulatorParams.distance} onChange={handleChange} />
                </div>
            </div>

            <div className="control-section">
                <h3>Geophysical Data</h3>
                <div className="control-group">
                    <label>Planet Radius: {simulatorParams.planetRadius} R⊕</label>
                    <input type="range" name="planetRadius" min="0.1" max="3" step="0.1" value={simulatorParams.planetRadius} onChange={handleChange} />
                </div>

                <div className="control-group">
                    <label>Atmosphere Density: {simulatorParams.atmosphereDensity}</label>
                    <input type="range" name="atmosphereDensity" min="0" max="10" step="0.1" value={simulatorParams.atmosphereDensity} onChange={handleChange} />
                </div>

                <div className="control-group">
                    <label>Surface Water: {Math.round(simulatorParams.surfaceWater * 100)}%</label>
                    <input type="range" name="surfaceWater" min="0" max="1" step="0.05" value={simulatorParams.surfaceWater} onChange={handleChange} />
                </div>

                <div className="control-group">
                    <label>Magnetic Shield: {Math.round(simulatorParams.magneticField * 100)}%</label>
                    <input type="range" name="magneticField" min="0" max="1" step="0.05" value={simulatorParams.magneticField} onChange={handleChange} />
                </div>
            </div>

            <div className="score-analysis">
                <div className="overall-score">
                    <svg className="score-ring" width="80" height="80">
                        <circle className="score-ring-bg" cx="40" cy="40" r={radius} />
                        <motion.circle
                            className="score-ring-fill"
                            cx="40" cy="40" r={radius}
                            style={{
                                strokeDasharray: circumference,
                                strokeDashoffset: offset,
                                stroke: total > 80 ? '#00ff88' : total > 50 ? '#00f0ff' : '#ff0055'
                            }}
                        />
                        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="score-text">
                            {total}
                        </text>
                    </svg>
                    <span className="score-label">Habitability Index</span>
                </div>

                <div className="factor-breakdown">
                    {factors.map(f => (
                        <div key={f.label} className="factor-item">
                            <div className="factor-header">
                                <span>{f.label}</span>
                                <span>{Math.round(f.value)}%</span>
                            </div>
                            <div className="factor-bar-bg">
                                <motion.div
                                    className="factor-bar-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${f.value}%` }}
                                    style={{ background: f.color }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {user && (
                    <button
                        className="save-btn-enhanced"
                        onClick={() => savePlanet({
                            id: Date.now().toString(),
                            name: `Proxima-${Math.floor(Math.random() * 900 + 100)}`,
                            type: simulatorParams.planetRadius > 1.5 ? 'Super-Earth' : 'Terrestrial',
                            distance: simulatorParams.distance,
                            mass: Math.pow(simulatorParams.planetRadius, 3), // Rough mass-radius relation
                            radius: simulatorParams.planetRadius,
                            temperature: 288 + (1 - simulatorParams.distance) * 50, // Approximation
                            discoveryYear: new Date().getFullYear(),
                            description: `A ${simulatorParams.planetRadius > 1.5 ? 'massive' : 'rocky'} world discovered in the simulator.`,
                            color: '#fff',
                            habitability: total,
                            atmosphere: simulatorParams.atmosphereDensity > 1 ? 'Thick' : 'Thin'
                        })}
                    >
                        <span>Archive Discovery</span>
                        <span className="btn-glow"></span>
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default Controls;
