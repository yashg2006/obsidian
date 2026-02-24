import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface GlobeProps {
    color?: string;
    size?: number;
    atmosphere?: boolean;
    atmosphereColor?: string;
    rotationSpeed?: number;
    hasClouds?: boolean;
    hasRings?: boolean;
    tilt?: number;
    surfaceWater?: number;
    temperature?: number;
    atmosphereDensity?: number;
}

// Advanced FBM (Fractal Brownian Motion) Noise Shaders
const terrainVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uDetail;
  uniform float uWaterLevel;
  
  // Hash function for random noise
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + .1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  // Value noise
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                   mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                   mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }

  // FBM to create complex terrain
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100);
    for (int i = 0; i < 6; ++i) {
      v += a * noise(p);
      p = p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    
    // Calculate noise-based elevation
    float elevation = fbm(position * 1.5 + uTime * 0.02);
    
    // Water displacement: if elevation is below water level, flatten it slightly
    float finalElevation = elevation;
    if (elevation < uWaterLevel) {
        finalElevation = mix(elevation, uWaterLevel, 0.7);
    }
    
    vec3 newPosition = position + normal * (finalElevation - 0.5) * 0.25;
    vPosition = newPosition;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const terrainFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  uniform vec3 uColor;
  uniform float uWaterLevel;
  uniform float uTemperature; // in Kelvin
  uniform float uTime;
  
  void main() {
    // 1. Calculate terrain height factor
    float height = length(vPosition) - 1.0;
    float normHeight = clamp(height * 6.0 + 0.5, 0.0, 1.0);
    
    // 2. Define colors based on height and water level
    vec3 deepWater = vec3(0.01, 0.05, 0.2);
    vec3 shallowWater = vec3(0.0, 0.4, 0.8);
    vec3 sand = vec3(0.76, 0.7, 0.5);
    vec3 grass = vec3(0.1, 0.4, 0.1);
    vec3 mountain = vec3(0.4, 0.3, 0.2);
    vec3 snow = vec3(0.95, 0.95, 1.0);
    vec3 lava = vec3(1.0, 0.2, 0.0);
    
    vec3 finalColor;
    
    // Water Logic
    if (normHeight < uWaterLevel) {
        float waterType = smoothstep(uWaterLevel - 0.1, uWaterLevel, normHeight);
        finalColor = mix(deepWater, shallowWater, waterType);
        
        // Add subtle water shimmer
        finalColor += 0.05 * sin(vPosition.x * 20.0 + uTime);
    } else {
        // Land Logic
        float landFactor = smoothstep(uWaterLevel, uWaterLevel + 0.3, normHeight);
        if (normHeight < uWaterLevel + 0.05) {
            finalColor = sand;
        } else if (normHeight < uWaterLevel + 0.4) {
            finalColor = mix(sand, grass, smoothstep(uWaterLevel + 0.05, uWaterLevel + 0.2, normHeight));
        } else {
            finalColor = mix(grass, mountain, smoothstep(uWaterLevel + 0.4, 0.8, normHeight));
            finalColor = mix(finalColor, snow, smoothstep(0.8, 0.95, normHeight));
        }
    }
    
    // 3. Temperature Effects
    // Extremely hot -> Lava veins
    if (uTemperature > 450.0) {
        float lavaVeins = pow(sin(vPosition.x * 10.0 + vPosition.y * 10.0 + uTime), 10.0);
        finalColor = mix(finalColor, lava, lavaVeins * clamp((uTemperature - 450.0) / 500.0, 0.0, 1.0));
    }
    
    // Extremely cold -> Frozen surface
    if (uTemperature < 220.0) {
        float frostFactor = clamp((220.0 - uTemperature) / 100.0, 0.0, 0.9);
        finalColor = mix(finalColor, snow, frostFactor);
    }
    
    // 4. Lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(normalize(vNormal), lightDir), 0.0);
    float ambient = 0.2;
    
    // Atmosphere glow Fresnel
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), 3.0);
    
    finalColor = finalColor * (ambient + diff * 0.8) + fresnel * vec3(0.4, 0.6, 1.0) * 0.4;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const Globe: React.FC<GlobeProps> = ({
    color = '#4682B4',
    size = 1.5,
    atmosphere = true,
    atmosphereColor = '#88ccff',
    rotationSpeed = 0.002,
    hasClouds = true,
    hasRings = false,
    tilt = 0.4,
    surfaceWater = 0.5,
    temperature = 288,
    atmosphereDensity = 1.0,
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const cloudRef = useRef<THREE.Mesh>(null);
    const atmosphereRef = useRef<THREE.Mesh>(null);

    const shaderUniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uWaterLevel: { value: surfaceWater },
        uTemperature: { value: temperature },
        uDetail: { value: 0.5 },
    }), [color, surfaceWater, temperature]);

    // Update uniforms when props change
    useEffect(() => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            if (material.uniforms) {
                material.uniforms.uWaterLevel.value = surfaceWater;
                material.uniforms.uTemperature.value = temperature;
                material.uniforms.uColor.value.set(color);
            }
        }
    }, [surfaceWater, temperature, color]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        if (meshRef.current) {
            meshRef.current.rotation.y += rotationSpeed;
            const material = meshRef.current.material as THREE.ShaderMaterial;
            if (material.uniforms) {
                material.uniforms.uTime.value = t;
            }
        }
        if (cloudRef.current) {
            cloudRef.current.rotation.y += rotationSpeed * 1.2;
            cloudRef.current.rotation.z += rotationSpeed * 0.05;
        }
        if (atmosphereRef.current) {
            const scale = 1.1 + Math.sin(t * 0.5) * 0.005;
            atmosphereRef.current.scale.setScalar(scale);
        }
    });

    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={2.5} color="#fff" />
            <pointLight position={[-10, -5, -10]} intensity={0.5} color="#334" />

            <group rotation={[tilt, 0, 0]}>
                {/* Main Planet Body */}
                <mesh ref={meshRef}>
                    <sphereGeometry args={[size, 128, 128]} />
                    <shaderMaterial
                        vertexShader={terrainVertexShader}
                        fragmentShader={terrainFragmentShader}
                        uniforms={shaderUniforms}
                        transparent={false}
                    />
                </mesh>

                {/* Cloud Layer */}
                {hasClouds && (
                    <mesh ref={cloudRef}>
                        <sphereGeometry args={[size * 1.03, 64, 64]} />
                        <meshPhongMaterial
                            color="#ffffff"
                            transparent
                            opacity={0.2 * atmosphereDensity}
                            depthWrite={false}
                            blending={THREE.AdditiveBlending}
                        />
                    </mesh>
                )}

                {/* Atmosphere Rim Glow */}
                {atmosphere && (
                    <mesh ref={atmosphereRef}>
                        <sphereGeometry args={[size * 1.12, 64, 64]} />
                        <meshPhongMaterial
                            color={atmosphereColor}
                            transparent
                            opacity={0.3 * Math.min(1.5, atmosphereDensity)}
                            side={THREE.BackSide}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                        />
                    </mesh>
                )}

                {/* Rings */}
                {hasRings && (
                    <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                        <ringGeometry args={[size * 1.4, size * 2.5, 128]} />
                        <meshBasicMaterial
                            color={color}
                            transparent
                            opacity={0.2}
                            side={THREE.DoubleSide}
                            blending={THREE.AdditiveBlending}
                        />
                    </mesh>
                )}
            </group>

            <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={size * 1.5}
                maxDistance={size * 10}
                autoRotate
                autoRotateSpeed={0.2}
            />
            <Stars radius={300} depth={50} count={10000} factor={4} saturation={0.5} fade speed={1} />
        </>
    );
};

export default Globe;
