import React, { useRef, useEffect, useState } from 'react';
import { exoplanets, Planet } from '../data/planets';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import './StarMap.css';

const StarMap: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();

    const planetPositionsRef = useRef<{ planet: Planet; x: number; y: number; radius: number }[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            canvas.height = canvas.parentElement?.clientHeight || 600;
        };
        resize();
        window.addEventListener('resize', resize);

        const maxDist = Math.max(...exoplanets.map(p => p.distance));
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const maxRadius = Math.min(cx, cy) - 60;

        // Calculate planet positions using golden angle for even distribution
        const positions = exoplanets.map((planet, i) => {
            const normalizedDist = (planet.distance / maxDist);
            const r = normalizedDist * maxRadius * 0.85 + 40;
            const angle = i * 2.399963 + Math.PI / 4; // golden angle
            return {
                planet,
                x: cx + Math.cos(angle) * r,
                y: cy + Math.sin(angle) * r,
                radius: Math.max(6, Math.min(14, planet.habitability / 10)),
            };
        });
        planetPositionsRef.current = positions;

        // Background stars
        const bgStars: { x: number; y: number; s: number; o: number }[] = [];
        for (let i = 0; i < 300; i++) {
            bgStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                s: Math.random() * 1.5 + 0.3,
                o: Math.random() * 0.4 + 0.1,
            });
        }

        let animId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const time = Date.now() * 0.001;

            // Background stars
            bgStars.forEach((star, i) => {
                const twinkle = Math.sin(time * 0.5 + i) * 0.3 + 0.7;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.s, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.o * twinkle})`;
                ctx.fill();
            });

            // Distance rings
            for (let i = 1; i <= 4; i++) {
                const ringR = (i / 4) * maxRadius;
                ctx.beginPath();
                ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Ring label
                const labelDist = Math.round((i / 4) * maxDist);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.font = '10px "Space Grotesk"';
                ctx.fillText(`${labelDist} ly`, cx + ringR + 4, cy - 4);
            }

            // Sun at center
            const sunGlow = Math.sin(time * 2) * 0.2 + 0.8;
            const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
            sunGrad.addColorStop(0, `rgba(255, 200, 50, ${sunGlow})`);
            sunGrad.addColorStop(0.4, 'rgba(255, 150, 0, 0.6)');
            sunGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(cx, cy, 20, 0, Math.PI * 2);
            ctx.fillStyle = sunGrad;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(cx, cy, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#ffcc33';
            ctx.fill();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '11px "Orbitron"';
            ctx.textAlign = 'center';
            ctx.fillText('SOL', cx, cy + 28);

            // Connection lines between nearby planets
            for (let i = 0; i < positions.length; i++) {
                for (let j = i + 1; j < positions.length; j++) {
                    const dx = positions[i].x - positions[j].x;
                    const dy = positions[i].y - positions[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        ctx.beginPath();
                        ctx.moveTo(positions[i].x, positions[i].y);
                        ctx.lineTo(positions[j].x, positions[j].y);
                        const alpha = 0.04 * (1 - dist / 140);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            // Draw planets
            positions.forEach(({ planet, x, y, radius }) => {
                const pulse = Math.sin(time * 1.5 + planet.habitability) * 2;
                
                // Glow
                const grad = ctx.createRadialGradient(x, y, 0, x, y, radius + 8 + pulse);
                grad.addColorStop(0, planet.color + 'cc');
                grad.addColorStop(0.5, planet.color + '44');
                grad.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(x, y, radius + 8 + pulse, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();

                // Planet body
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = planet.color;
                ctx.fill();

                // Highlight
                ctx.beginPath();
                ctx.arc(x - radius * 0.25, y - radius * 0.25, radius * 0.35, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fill();

                // Label
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.font = '10px "Space Grotesk"';
                ctx.textAlign = 'center';
                ctx.fillText(planet.name, x, y + radius + 16);
            });

            animId = requestAnimationFrame(animate);
        };
        animate();

        // Mouse interactions
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;

            let found: Planet | null = null;
            for (const pos of planetPositionsRef.current) {
                const dx = mx - pos.x;
                const dy = my - pos.y;
                if (Math.sqrt(dx * dx + dy * dy) < pos.radius + 8) {
                    found = pos.planet;
                    break;
                }
            }
            setHoveredPlanet(found);
            setTooltipPos({ x: e.clientX, y: e.clientY });
            canvas.style.cursor = found ? 'pointer' : 'default';
        };

        const handleClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;

            for (const pos of planetPositionsRef.current) {
                const dx = mx - pos.x;
                const dy = my - pos.y;
                if (Math.sqrt(dx * dx + dy * dy) < pos.radius + 8) {
                    navigate(`/simulator?id=${pos.planet.id}`);
                    break;
                }
            }
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('click', handleClick);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('click', handleClick);
        };
    }, [navigate]);

    return (
        <div className="starmap-page page-transition">
            <motion.div
                className="starmap-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>Interactive <span className="gradient-text">Star Map</span></h1>
                <p className="starmap-subtitle">
                    A constellation-style map of known exoplanets — click any world to explore it in 3D
                </p>
            </motion.div>

            <motion.div
                className="starmap-canvas-wrapper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                <canvas ref={canvasRef} className="starmap-canvas" />

                {hoveredPlanet && (
                    <div
                        className="starmap-tooltip"
                        style={{ left: tooltipPos.x + 16, top: tooltipPos.y - 10 }}
                    >
                        <div className="tooltip-name">{hoveredPlanet.name}</div>
                        <div className="tooltip-type">{hoveredPlanet.type}</div>
                        <div className="tooltip-stats">
                            <span>📏 {hoveredPlanet.distance} ly</span>
                            <span>🌡️ {hoveredPlanet.temperature}K</span>
                            <span>🌿 {hoveredPlanet.habitability}%</span>
                        </div>
                        <div className="tooltip-hint">Click to explore</div>
                    </div>
                )}
            </motion.div>

            <div className="starmap-legend">
                <div className="legend-item">
                    <div className="legend-dot" style={{ background: '#ffcc33' }} />
                    <span>Sol (Our Sun)</span>
                </div>
                <div className="legend-item">
                    <div className="legend-ring" />
                    <span>Distance rings (light years)</span>
                </div>
                <div className="legend-item">
                    <div className="legend-dot" style={{ background: 'var(--color-primary)', width: '12px', height: '12px' }} />
                    <span>Exoplanet (size = habitability)</span>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default StarMap;
