import React, { Suspense } from 'react';
import { Planet } from '../data/planets';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import './PlanetCard.css';

interface PlanetCardProps {
    planet: Planet;
    index?: number;
}

// Lightweight mini planet for cards (no heavy shaders)
const MiniPlanet: React.FC<{ color: string }> = ({ color }) => {
    const meshRef = React.useRef<THREE.Mesh>(null);

    React.useEffect(() => {
        let animId: number;
        const animate = () => {
            if (meshRef.current) {
                meshRef.current.rotation.y += 0.008;
            }
            animId = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animId);
    }, []);

    const baseColor = new THREE.Color(color);
    const hsl = { h: 0, s: 0, l: 0 };
    baseColor.getHSL(hsl);
    const atmosphereColor = new THREE.Color().setHSL(hsl.h, Math.min(hsl.s + 0.3, 1), Math.min(hsl.l + 0.2, 0.8));

    return (
        <>
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} intensity={1.5} />
            <pointLight position={[-3, -2, -3]} intensity={0.3} color="#335" />

            <Sphere ref={meshRef} args={[1, 64, 64]}>
                <meshStandardMaterial
                    color={color}
                    roughness={0.6}
                    metalness={0.15}
                    emissive={color}
                    emissiveIntensity={0.05}
                />
            </Sphere>

            {/* Atmosphere */}
            <Sphere args={[1.12, 32, 32]}>
                <meshPhongMaterial
                    color={atmosphereColor}
                    transparent
                    opacity={0.2}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </Sphere>

            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
        </>
    );
};

const PlanetCard: React.FC<PlanetCardProps> = ({ planet, index = 0 }) => {
    const tempC = planet.temperature - 273;
    const tempDisplay = tempC > 0 ? `+${tempC.toFixed(0)}°C` : `${tempC.toFixed(0)}°C`;

    return (
        <motion.div
            className="planet-card"
            whileHover={{ y: -8, scale: 1.02 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
        >
            {/* Shimmer border effect */}
            <div className="card-shimmer" />

            {/* Mini 3D Canvas */}
            <div className="card-canvas-container">
                <Canvas camera={{ position: [0, 0, 3], fov: 40 }}>
                    <Suspense fallback={null}>
                        <MiniPlanet color={planet.color} />
                    </Suspense>
                </Canvas>
                {/* Orbital ring */}
                <div className="orbital-ring" style={{ borderColor: `${planet.color}60` }} />
            </div>

            <div className="card-info">
                <h3 className="planet-name">{planet.name}</h3>
                <p className="planet-type">{planet.type}</p>

                {/* Stats grid */}
                <div className="planet-stats-grid">
                    <div className="stat-item">
                        <span className="stat-label">Distance</span>
                        <span className="stat-value">{planet.distance} ly</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Mass</span>
                        <span className="stat-value">{planet.mass}x Earth</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Temp</span>
                        <span className="stat-value">{tempDisplay}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Found</span>
                        <span className="stat-value">{planet.discoveryYear}</span>
                    </div>
                </div>

                {/* Habitability bar */}
                <div className="habitability-section">
                    <div className="habitability-header">
                        <span className="habitability-label">Habitability</span>
                        <span className={`habitability-value ${planet.habitability > 80 ? 'high' : planet.habitability > 50 ? 'medium' : 'low'}`}>
                            {planet.habitability}%
                        </span>
                    </div>
                    <div className="habitability-bar-bg">
                        <motion.div
                            className="habitability-bar-fill"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${planet.habitability}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: 'easeOut' }}
                            style={{
                                background: planet.habitability > 80
                                    ? 'linear-gradient(90deg, #00ff88, #00f0ff)'
                                    : planet.habitability > 50
                                        ? 'linear-gradient(90deg, #ffaa00, #ff6600)'
                                        : 'linear-gradient(90deg, #ff0055, #ff4400)'
                            }}
                        />
                    </div>
                </div>

                <Link to={`/simulator?id=${planet.id}`} className="view-btn">
                    <span className="btn-icon">🔭</span> Explore in 3D
                </Link>
            </div>
        </motion.div>
    );
};

export default PlanetCard;
