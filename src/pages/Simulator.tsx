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
    const {
        simulatorParams,
        updateSimulatorParams,
        habitabilityScore,
        calculatedTemp
    } = useStore();

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
                distance: loadedPlanet.distance / 10, // Normalized for simulation
                starType: 'G',
                magneticField: 0.8
            });
        }
    }, [planetId, updateSimulatorParams, loadedPlanet]);

    return (
        <div className="simulator-page">
            <div className="canvas-container">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <color attach="background" args={['#020205']} />
                    <Globe
                        color={loadedPlanet ? loadedPlanet.color : '#4682B4'}
                        size={Math.min(2.5, Math.max(0.5, simulatorParams.planetRadius))}
                        rotationSpeed={0.0015}
                        atmosphere={simulatorParams.atmosphereDensity > 0.1}
                        atmosphereColor={calculatedTemp > 400 ? '#ff8800' : calculatedTemp < 250 ? '#88ccff' : '#87CEEB'}
                        hasClouds={simulatorParams.atmosphereDensity > 0.3 && calculatedTemp < 500}
                        hasRings={simulatorParams.planetRadius > 2.2}
                        surfaceWater={simulatorParams.surfaceWater}
                        temperature={calculatedTemp}
                        atmosphereDensity={simulatorParams.atmosphereDensity}
                    />
                </Canvas>
            </div>

            {/* Planet Info HUD */}
            <motion.div
                className="planet-hud"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="hud-badge">{loadedPlanet ? loadedPlanet.type : (simulatorParams.planetRadius > 1.5 ? 'Super-Earth' : 'Terrestrial')}</div>
                <h2 className="hud-name">{loadedPlanet ? loadedPlanet.name : 'Unknown Discovery'}</h2>
                <p className="hud-desc">{loadedPlanet ? loadedPlanet.description : 'Simulating a newly discovered world in a distant stellar system.'}</p>

                <div className="hud-stats">
                    <div className="hud-stat">
                        <span className="hud-stat-val" style={{ color: calculatedTemp > 373 ? '#ff4400' : calculatedTemp < 273 ? '#00ccff' : '#00ff88' }}>
                            {calculatedTemp}K
                        </span>
                        <span className="hud-stat-label">Surface Temp</span>
                    </div>
                    <div className="hud-stat">
                        <span className="hud-stat-val" style={{ color: habitabilityScore > 80 ? '#00ff88' : '#fff' }}>
                            {habitabilityScore}%
                        </span>
                        <span className="hud-stat-label">Habitability</span>
                    </div>
                    <div className="hud-stat">
                        <span className="hud-stat-val">{simulatorParams.planetRadius} R⊕</span>
                        <span className="hud-stat-label">Radius</span>
                    </div>
                </div>
            </motion.div>

            <Controls />
        </div>
    );
};

export default Simulator;
