import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls, Stars, Ring } from '@react-three/drei';
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
    surfaceDetail?: number; // 0-1
}

// Custom vertex shader for terrain displacement
const terrainVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uDetail;
  
  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vUv = uv;
    vNormal = normal;
    
    float noise = snoise(position * 2.0 + uTime * 0.05) * 0.5 +
                  snoise(position * 4.0 - uTime * 0.03) * 0.25 +
                  snoise(position * 8.0 + uTime * 0.02) * 0.125;
    
    vec3 newPosition = position + normal * noise * uDetail * 0.15;
    vPosition = newPosition;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// Custom fragment shader for terrain coloring
const terrainFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform vec3 uColor;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uTime;
  
  void main() {
    // Compute noise-based terrain factor from position
    float h = length(vPosition) - 1.0; // Height above base sphere
    float normalizedH = clamp(h * 5.0 + 0.5, 0.0, 1.0);
    
    // Mix colors based on height: deep (ocean) → mid (land) → high (ice/mountain)
    vec3 color = mix(uColor, uColor2, smoothstep(0.3, 0.5, normalizedH));
    color = mix(color, uColor3, smoothstep(0.6, 0.85, normalizedH));
    
    // Simple lighting based on normal
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(normalize(vNormal), lightDir), 0.0);
    float ambient = 0.3;
    
    // Rim light for edge glow
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float rim = 1.0 - max(dot(viewDir, normalize(vNormal)), 0.0);
    rim = pow(rim, 3.0) * 0.6;
    
    vec3 finalColor = color * (ambient + diff * 0.7) + rim * uColor * 0.5;
    
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
    surfaceDetail = 0.5,
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const cloudRef = useRef<THREE.Mesh>(null);
    const atmosphereRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    // Parse the main color and create complementary terrain colors
    const colors = useMemo(() => {
        const base = new THREE.Color(color);
        const hsl = { h: 0, s: 0, l: 0 };
        base.getHSL(hsl);

        // Deep color (darker, more saturated — oceans/valleys)
        const deep = new THREE.Color().setHSL(hsl.h + 0.05, Math.min(hsl.s + 0.2, 1), Math.max(hsl.l - 0.25, 0.05));
        // Mid color (the base — land)
        const mid = base.clone();
        // High color (lighter, desaturated — mountains/ice)
        const high = new THREE.Color().setHSL(hsl.h - 0.05, Math.max(hsl.s - 0.3, 0), Math.min(hsl.l + 0.3, 0.95));

        return { deep, mid, high };
    }, [color]);

    // Shader uniforms
    const shaderUniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: colors.deep },
        uColor2: { value: colors.mid },
        uColor3: { value: colors.high },
        uDetail: { value: surfaceDetail },
    }), [colors, surfaceDetail]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        if (meshRef.current) {
            meshRef.current.rotation.y += rotationSpeed;
            // Update shader time
            const material = meshRef.current.material as THREE.ShaderMaterial;
            if (material.uniforms) {
                material.uniforms.uTime.value = t;
            }
        }
        if (cloudRef.current) {
            cloudRef.current.rotation.y += rotationSpeed * 1.3;
            cloudRef.current.rotation.x += rotationSpeed * 0.15;
        }
        if (atmosphereRef.current) {
            // Subtle breathing animation
            const scale = 1 + Math.sin(t * 0.5) * 0.01;
            atmosphereRef.current.scale.setScalar(scale);
        }
    });

    return (
        <>
            <ambientLight intensity={0.35} />
            <pointLight position={[10, 8, 10]} intensity={2} color="#fff" castShadow />
            <pointLight position={[-8, -5, -8]} intensity={0.4} color="#334" />
            <pointLight position={[0, 10, -5]} intensity={0.3} color="#aaf" />

            <group ref={groupRef} rotation={[tilt, 0, 0]}>
                {/* Main Planet with procedural shader */}
                <mesh ref={meshRef}>
                    <sphereGeometry args={[size, 128, 128]} />
                    <shaderMaterial
                        vertexShader={terrainVertexShader}
                        fragmentShader={terrainFragmentShader}
                        uniforms={shaderUniforms}
                    />
                </mesh>

                {/* Cloud Layer */}
                {hasClouds && (
                    <mesh ref={cloudRef}>
                        <sphereGeometry args={[size * 1.02, 64, 64]} />
                        <meshPhongMaterial
                            color="#ffffff"
                            transparent
                            opacity={0.15}
                            depthWrite={false}
                            blending={THREE.AdditiveBlending}
                        />
                    </mesh>
                )}

                {/* Fresnel Atmosphere Rim */}
                {atmosphere && (
                    <mesh ref={atmosphereRef}>
                        <sphereGeometry args={[size * 1.15, 64, 64]} />
                        <meshPhongMaterial
                            color={atmosphereColor}
                            transparent
                            opacity={0.25}
                            side={THREE.BackSide}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                        />
                    </mesh>
                )}

                {/* Inner atmosphere glow (Fresnel-like) */}
                {atmosphere && (
                    <mesh>
                        <sphereGeometry args={[size * 1.08, 64, 64]} />
                        <meshPhongMaterial
                            color={atmosphereColor}
                            transparent
                            opacity={0.08}
                            side={THREE.FrontSide}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                        />
                    </mesh>
                )}

                {/* Rings */}
                {hasRings && (
                    <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                        <ringGeometry args={[size * 1.4, size * 2.2, 128]} />
                        <meshBasicMaterial
                            color={color}
                            transparent
                            opacity={0.3}
                            side={THREE.DoubleSide}
                            blending={THREE.AdditiveBlending}
                        />
                    </mesh>
                )}
            </group>

            <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={size * 2}
                maxDistance={size * 6}
                autoRotate
                autoRotateSpeed={0.3}
            />
            <Stars radius={300} depth={60} count={7000} factor={4} saturation={0.2} fade speed={0.5} />
        </>
    );
};

export default Globe;
