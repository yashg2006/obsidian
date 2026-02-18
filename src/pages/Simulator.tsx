import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSearchParams } from 'react-router-dom';
import Globe from '../components/Globe';
import Controls from '../components/Controls';
import { useStore } from '../store/useStore';
import { exoplanets, Planet } from '../data/planets';
import { motion } from 'framer-motion';
import './Simulator.css';

const Simulator: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { simulatorParams, updateSimulatorParams } = useStore();
    const planetId = searchParams.get('id');
    const loadedPlanet: Planet | undefined = planetId ? exoplanets.find(p => p.id === planetId) : undefined;

    useEffect(() => {
        if (loadedPlanet) {
            updateSimulatorParams({
                planetRadius: loadedPlanet.radius,
                surfaceWater: loadedPlanet.type.includes('Terrestrial') && loadedPlanet.habitability > 80 ? 0.7 :
                    loadedPlanet.type.includes('Super-Earth') ? 0.4 : 0.1,
                atmosphereDensity: loadedPlanet.atmosphere.includes('Thick') ? 2 :
                    loadedPlanet.atmosphere.includes('Thin') ? 0.5 : 1,
                distance: loadedPlanet.habitability > 80 ? 1 : 0.5,
                starType: 'M',
            });
        }
    }, [planetId, updateSimulatorParams]);

    // Determine globe color based on params
    const getPlanetColor = () => {
        const { surfaceWater, atmosphereDensity } = simulatorParams;
        if (surfaceWater > 0.8) return '#1E90FF';
        if (surfaceWater > 0.6) return '#2E8B57';
        if (surfaceWater > 0.3) return '#8B4513';
        if (atmosphereDensity > 3) return '#DAA520';
        if (atmosphereDensity < 0.2) return '#A9A9A9';
        return '#CD853F';
    };

    const globeColor = loadedPlanet ? loadedPlanet.color : getPlanetColor();

    return (
        <div className="simulator-page">
            <div className="canvas-container">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                    <color attach="background" args={['#030308']} />
                    <Globe
                        color={globeColor}
                        size={Math.min(2.5, Math.max(0.5, simulatorParams.planetRadius))}
                        rotationSpeed={0.002}
                        atmosphere={simulatorParams.atmosphereDensity > 0.3}
                        atmosphereColor={simulatorParams.atmosphereDensity > 2 ? '#FFA500' : '#87CEEB'}
                        hasClouds={simulatorParams.atmosphereDensity > 0.5}
                        hasRings={simulatorParams.planetRadius > 2}
                        surfaceDetail={Math.min(1, simulatorParams.atmosphereDensity * 0.3 + 0.2)}
                    />
                </Canvas>
            </div>

            {/* Planet Info HUD */}
            {loadedPlanet && (
                <motion.div
                    className="planet-hud"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    <div className="hud-badge">{loadedPlanet.type}</div>
                    <h2 className="hud-name">{loadedPlanet.name}</h2>
                    <p className="hud-desc">{loadedPlanet.description}</p>
                    <div className="hud-stats">
                        <div className="hud-stat">
                            <span className="hud-stat-val">{loadedPlanet.distance} ly</span>
                            <span className="hud-stat-label">Distance</span>
                        </div>
                        <div className="hud-stat">
                            <span className="hud-stat-val">{(loadedPlanet.temperature - 273).toFixed(0)}°C</span>
                            <span className="hud-stat-label">Temperature</span>
                        </div>
                        <div className="hud-stat">
                            <span className="hud-stat-val">{loadedPlanet.habitability}%</span>
                            <span className="hud-stat-label">Habitability</span>
                        </div>
                    </div>
                </motion.div>
            )}

            <Controls />
        </div>
    );
};

export default Simulator;
