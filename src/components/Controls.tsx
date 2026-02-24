import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import './Controls.css';

const Controls: React.FC = () => {
    const {
        simulatorParams,
        updateSimulatorParams,
        savePlanet,
        user,
        habitabilityScore,
        calculatedTemp
    } = useStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateSimulatorParams({ [name]: name === 'starType' ? value : parseFloat(value) });
    };

    // Factors for display (derived from params for the UI bars)
    const factors = useMemo(() => {
        const { distance, planetRadius, atmosphereDensity, surfaceWater, magneticField } = simulatorParams;
        return [
            { label: 'Orbital Distance', value: Math.max(0, 100 - Math.abs(distance - 1.0) * 80), color: '#00f0ff' },
            { label: 'Planet Mass', value: Math.max(0, 100 - Math.abs(planetRadius - 1.0) * 100), color: '#7000ff' },
            { label: 'Atmosphere', value: Math.max(0, 100 - Math.abs(atmosphereDensity - 1.0) * 50), color: '#ffaa00' },
            { label: 'Liquid Water', value: surfaceWater * 100, color: '#00ff88' },
            { label: 'Magnetic Shield', value: magneticField * 100, color: '#ff0055' },
            { label: 'Temp (Kelvin)', value: Math.min(100, (calculatedTemp / 500) * 100), color: '#ff6600' }
        ];
    }, [simulatorParams, calculatedTemp]);

    // SVG ring calculations
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (habitabilityScore / 100) * circumference;

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
                    <div className="temp-badge" style={{ color: calculatedTemp > 373 ? '#ff4400' : calculatedTemp < 273 ? '#00ccff' : '#00ff88' }}>
                        {calculatedTemp}K
                    </div>
                    <svg className="score-ring" width="80" height="80">
                        <circle className="score-ring-bg" cx="40" cy="40" r={radius} />
                        <motion.circle
                            className="score-ring-fill"
                            cx="40" cy="40" r={radius}
                            style={{
                                strokeDasharray: circumference,
                                strokeDashoffset: offset,
                                stroke: habitabilityScore > 80 ? '#00ff88' : habitabilityScore > 50 ? '#00f0ff' : '#ff0055'
                            }}
                        />
                        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="score-text">
                            {habitabilityScore}
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
                            mass: Math.pow(simulatorParams.planetRadius, 3),
                            radius: simulatorParams.planetRadius,
                            temperature: calculatedTemp,
                            discoveryYear: new Date().getFullYear(),
                            description: `A ${simulatorParams.planetRadius > 1.5 ? 'massive' : 'rocky'} world discovered with ${habitabilityScore}% habitability.`,
                            color: '#fff',
                            habitability: habitabilityScore,
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
