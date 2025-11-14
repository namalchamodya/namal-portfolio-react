// src/components/BlackHoleBackground.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// Make sure these paths are correct for your version (they seem to be)
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// --- Shader and Constant Definitions ---
const BLACK_HOLE_RADIUS = 0.5;
const DISK_INNER_RADIUS = BLACK_HOLE_RADIUS + 0.2;
const DISK_OUTER_RADIUS = 8.0;
const DISK_TILT_ANGLE = Math.PI / 3.0;

// Lensing Shader (runs on the GPU)
const lensingShader = {
    uniforms: {
        "tDiffuse": { value: null },
        "blackHoleScreenPos": { value: new THREE.Vector2(0.5, 0.5) },
        "lensingStrength": { value: 0.12 },
        "lensingRadius": { value: 0.3 },
        "aspectRatio": { value: window.innerWidth / window.innerHeight },
        "chromaticAberration": { value: 0.005 }
    },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 blackHoleScreenPos;
        uniform float lensingStrength;
        uniform float lensingRadius;
        uniform float aspectRatio;
        uniform float chromaticAberration;
        varying vec2 vUv;
        
        void main() {
            vec2 screenPos = vUv;
            vec2 toCenter = screenPos - blackHoleScreenPos;
            toCenter.x *= aspectRatio;
            float dist = length(toCenter);
            
            float distortionAmount = lensingStrength / (dist * dist + 0.003);
            distortionAmount = clamp(distortionAmount, 0.0, 0.7);
            float falloff = smoothstep(lensingRadius, lensingRadius * 0.3, dist);
            distortionAmount *= falloff;
            
            vec2 offset = normalize(toCenter) * distortionAmount;
            offset.x /= aspectRatio;
            
            vec2 distortedUvR = screenPos - offset * (1.0 + chromaticAberration);
            vec2 distortedUvG = screenPos - offset;
            vec2 distortedUvB = screenPos - offset * (1.0 - chromaticAberration);
            
            float r = texture2D(tDiffuse, distortedUvR).r;
            float g = texture2D(tDiffuse, distortedUvG).g;
            float b = texture2D(tDiffuse, distortedUvB).b;
            
            gl_FragColor = vec4(r, g, b, 1.0);
        }`
};

// Star Shader
const starMaterialShader = {
    uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) }
    },
    vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float size;
        attribute float twinkle;
        varying vec3 vColor;
        varying float vTwinkle;
        
        void main() {
            vColor = color;
            vTwinkle = sin(uTime * 2.5 + twinkle) * 0.5 + 0.5;
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        varying vec3 vColor;
        varying float vTwinkle;
        
        void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            alpha *= (0.2 + vTwinkle * 0.8);
            
            gl_FragColor = vec4(vColor, alpha);
        }
    `
};

// Particle Shader
const particleShader = {
    uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) }
    },
    vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float size;
        attribute float speed;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
            vColor = color;
            
            // Pulsating effect
            float pulse = sin(uTime * speed + position.x + position.y + position.z) * 0.3 + 0.7;
            vAlpha = pulse;
            
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * uPixelRatio * pulse * (150.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            alpha *= vAlpha;
            
            gl_FragColor = vec4(vColor, alpha * 0.9);
        }
    `
};

// Event Horizon Shader
const eventHorizonShader = {
    uniforms: {
        uTime: { value: 0 },
        uCameraPosition: { value: new THREE.Vector3() }
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform vec3 uCameraPosition;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            vec3 viewDirection = normalize(uCameraPosition - vPosition);
            float fresnel = 1.0 - abs(dot(vNormal, viewDirection));
            fresnel = pow(fresnel, 2.5);
            
            vec3 glowColor = vec3(1.0, 0.4, 0.1);
            float pulse = sin(uTime * 2.5) * 0.15 + 0.85;
            
            gl_FragColor = vec4(glowColor * fresnel * pulse, fresnel * 0.4);
        }
    `
};

// Accretion Disk Shader
const diskShader = {
    uniforms: {
        uTime: { value: 0.0 },
        uColorHot: { value: new THREE.Color(0xffffff) },
        uColorMid1: { value: new THREE.Color(0xff7733) },
        uColorMid2: { value: new THREE.Color(0xff4477) },
        uColorMid3: { value: new THREE.Color(0x7744ff) },
        uColorOuter: { value: new THREE.Color(0x4477ff) },
        uNoiseScale: { value: 2.5 },
        uFlowSpeed: { value: 0.22 },
        uDensity: { value: 1.3 }
    },
    vertexShader: `
        varying vec2 vUv;
        varying float vRadius;
        varying float vAngle;
        void main() {
            vUv = uv;
            vRadius = length(position.xy);
            vAngle = atan(position.y, position.x);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorHot;
        uniform vec3 uColorMid1;
        uniform vec3 uColorMid2;
        uniform vec3 uColorMid3;
        uniform vec3 uColorOuter;
        uniform float uNoiseScale;
        uniform float uFlowSpeed;
        uniform float uDensity;
        varying vec2 vUv;
        varying float vRadius;
        varying float vAngle;

        // GLSL 3D simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy) ); vec3 x0 = v - i + dot(i, C.xxx) ;
            vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g; vec3 i1 = min( g.xyz, l.zxy ); vec3 i2 = max( g.xyz, l.zxy );
            vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
            float n_ = 0.142857142857; vec3  ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_ );
            vec4 x = x_ *ns.x + ns.yyyy; vec4 y = y_ *ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4( x.xy, y.xy ); vec4 b1 = vec4( x.zw, y.zw );
            vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
            vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y); vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
            float normalizedRadius = smoothstep(${DISK_INNER_RADIUS.toFixed(2)}, ${DISK_OUTER_RADIUS.toFixed(2)}, vRadius);
            float spiral = vAngle * 3.0 - (1.0 / (normalizedRadius + 0.1)) * 2.0;
            vec2 noiseUv = vec2(vUv.x + uTime * uFlowSpeed * (2.0 / (vRadius * 0.3 + 1.0)) + sin(spiral) * 0.1, vUv.y * 0.8 + cos(spiral) * 0.1);
            float noiseVal1 = snoise(vec3(noiseUv * uNoiseScale, uTime * 0.15));
            float noiseVal2 = snoise(vec3(noiseUv * uNoiseScale * 3.0 + 0.8, uTime * 0.22));
            float noiseVal3 = snoise(vec3(noiseUv * uNoiseScale * 6.0 + 1.5, uTime * 0.3));
            float noiseVal = (noiseVal1 * 0.45 + noiseVal2 * 0.35 + noiseVal3 * 0.2);
            noiseVal = (noiseVal + 1.0) * 0.5;
            
            vec3 color = uColorOuter;
            color = mix(color, uColorMid3, smoothstep(0.0, 0.25, normalizedRadius));
            color = mix(color, uColorMid2, smoothstep(0.2, 0.55, normalizedRadius));
            color = mix(color, uColorMid1, smoothstep(0.5, 0.75, normalizedRadius));
            color = mix(color, uColorHot, smoothstep(0.7, 0.95, normalizedRadius));
            
            color *= (0.5 + noiseVal * 1.0);
            float brightness = pow(1.0 - normalizedRadius, 1.0) * 3.5 + 0.5;
            brightness *= (0.3 + noiseVal * 2.2);
            float pulse = sin(uTime * 1.8 + normalizedRadius * 12.0 + vAngle * 2.0) * 0.15 + 0.85;
            brightness *= pulse;
            
            float alpha = uDensity * (0.2 + noiseVal * 0.9);
            alpha *= smoothstep(0.0, 0.15, normalizedRadius);
            alpha *= (1.0 - smoothstep(0.85, 1.0, normalizedRadius));
            alpha = clamp(alpha, 0.0, 1.0);
            gl_FragColor = vec4(color * brightness, alpha);
        }
    `
};


// --- React Component ---

const BlackHoleBackground = () => {
    const mountRef = useRef(null);
    const controlsRef = useRef(null);
    const [autoRotate, setAutoRotate] = useState(false);
    const [infoVisible, setInfoVisible] = useState(true);

    useEffect(() => {
        const mount = mountRef.current;
        let animationFrameId;
        let resizeTimeout;

        // --- Scene Setup ---
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x020104, 0.025);

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 4000);
        camera.position.set(-6.5, 5.0, 6.5);

        const cameraRig = new THREE.Group();
        cameraRig.add(camera);
        scene.add(cameraRig);

        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        
        renderer.outputEncoding = THREE.sRGBEncoding; 

        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        mount.appendChild(renderer.domElement);

        // --- Post-processing ---
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 0.7, 0.8
        );
        composer.addPass(bloomPass);

        const lensingPass = new ShaderPass(lensingShader);
        composer.addPass(lensingPass);

        // --- Controls ---
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; controls.dampingFactor = 0.035;
        controls.rotateSpeed = 0.4; controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = 0.1;
        controls.target.set(-7.5, 0, 0);
        controls.minDistance = 2.5;
        controls.maxDistance = 100;
        controls.enablePan = false;
        controls.update();
        controlsRef.current = controls;

        // --- Mouse Listener for Parallax ---
        const mouse = new THREE.Vector2(0, 0);
        const onMouseMove = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove);

        // --- Starfield ---
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 150000;
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);
        const starSizes = new Float32Array(starCount);
        const starTwinkle = new Float32Array(starCount);
        const starFieldRadius = 2000;
        const starPalette = [
            new THREE.Color(0x88aaff), new THREE.Color(0xffaaff), new THREE.Color(0xaaffff),
            new THREE.Color(0xffddaa), new THREE.Color(0xffeecc), new THREE.Color(0xffffff),
            new THREE.Color(0xff8888), new THREE.Color(0x88ff88), new THREE.Color(0xffff88),
            new THREE.Color(0x88ffff)
        ];

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            const phi = Math.acos(-1 + (2 * i) / starCount);
            const theta = Math.sqrt(starCount * Math.PI) * phi;
            const radius = Math.cbrt(Math.random()) * starFieldRadius + 100;

            starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            starPositions[i3 + 2] = radius * Math.cos(phi);

            const starColor = starPalette[Math.floor(Math.random() * starPalette.length)].clone();
            starColor.multiplyScalar(Math.random() * 0.7 + 0.3);
            starColors[i3] = starColor.r; starColors[i3 + 1] = starColor.g; starColors[i3 + 2] = starColor.b;
            starSizes[i] = THREE.MathUtils.randFloat(5, 3.0);
            starTwinkle[i] = Math.random() * Math.PI * 2;
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
        starGeometry.setAttribute('twinkle', new THREE.BufferAttribute(starTwinkle, 1));

        const starMaterial = new THREE.ShaderMaterial({
            ...starMaterialShader,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // --- 3D Particles System with Initial Positions ---
        const particleCount = 500;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleInitialPositions = new Float32Array(particleCount * 3); // Store initial positions
        const particleColors = new Float32Array(particleCount * 3);
        const particleSizes = new Float32Array(particleCount);
        const particleSpeeds = new Float32Array(particleCount);
        
        // ++ ADDED ++
        const particleOrbitalSpeeds = new Float32Array(particleCount);
        const particleOrbitOffsets = new Float32Array(particleCount);
        
        const particlePalette = [
            new THREE.Color(0xfff5e6), // Very light cream
            new THREE.Color(0xfef9ef), // Ivory
            new THREE.Color(0xfff0f5), // Lavender blush
            new THREE.Color(0xf0f8ff), // Alice blue
            new THREE.Color(0xfffacd), // Lemon chiffon
            new THREE.Color(0xfaf0e6), // Linen
            new THREE.Color(0xfff5ee), // Seashell
            new THREE.Color(0xf5f5f5), // White smoke
        ];

        const particleSpread = 50; // Spread in XYZ directions

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random positions in 3D space
            const x = (Math.random() - 0.5) * particleSpread;
            const y = (Math.random() - 0.5) * particleSpread;
            const z = (Math.random() - 0.5) * particleSpread;
            
            particlePositions[i3] = x;
            particlePositions[i3 + 1] = y;
            particlePositions[i3 + 2] = z;
            
            // Store initial positions
            particleInitialPositions[i3] = x;
            particleInitialPositions[i3 + 1] = y;
            particleInitialPositions[i3 + 2] = z;

            const particleColor = particlePalette[Math.floor(Math.random() * particlePalette.length)].clone();
            particleColor.multiplyScalar(Math.random() * 0.15 + 0.85); // Keep colors very bright
            particleColors[i3] = particleColor.r;
            particleColors[i3 + 1] = particleColor.g;
            particleColors[i3 + 2] = particleColor.b;

            // Random sizes
            particleSizes[i] = THREE.MathUtils.randFloat(2.0, 6.0);
            
            // Random animation speeds
            particleSpeeds[i] = THREE.MathUtils.randFloat(1.0, 3.0);
            
            // ++ ADDED ++
            particleOrbitalSpeeds[i] = THREE.MathUtils.randFloat(0.05, 0.2); // How fast it orbits
            particleOrbitOffsets[i] = Math.random() * Math.PI * 2; // Random start angle
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
        particleGeometry.setAttribute('speed', new THREE.BufferAttribute(particleSpeeds, 1));
        
        // ++ ADDED ++
        particleGeometry.setAttribute('orbitalSpeed', new THREE.BufferAttribute(particleOrbitalSpeeds, 1));
        particleGeometry.setAttribute('orbitOffset', new THREE.BufferAttribute(particleOrbitOffsets, 1));

        const particleMaterial = new THREE.ShaderMaterial({
            ...particleShader,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // --- Event Horizon ---
        const eventHorizonGeom = new THREE.SphereGeometry(BLACK_HOLE_RADIUS * 1.05, 128, 64);
        const eventHorizonMat = new THREE.ShaderMaterial({
            ...eventHorizonShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });
        const eventHorizon = new THREE.Mesh(eventHorizonGeom, eventHorizonMat);
        scene.add(eventHorizon);

        // --- Black Hole Sphere ---
        const blackHoleGeom = new THREE.SphereGeometry(BLACK_HOLE_RADIUS, 128, 64);
        const blackHoleMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const blackHoleMesh = new THREE.Mesh(blackHoleGeom, blackHoleMat);
        blackHoleMesh.renderOrder = 0;
        scene.add(blackHoleMesh);

        // --- Accretion Disk ---
        const diskGeometry = new THREE.RingGeometry(DISK_INNER_RADIUS, DISK_OUTER_RADIUS, 256, 128);
        const diskMaterial = new THREE.ShaderMaterial({
            ...diskShader,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
        
        accretionDisk.rotation.x = DISK_TILT_ANGLE;
        accretionDisk.renderOrder = 1;
        scene.add(accretionDisk);

        // --- Hide Info Box Timer ---
        const infoTimer = setTimeout(() => setInfoVisible(false), 5000);

        // --- Resize Handler ---
        const onResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                composer.setSize(window.innerWidth, window.innerHeight);
                bloomPass.resolution.set(window.innerWidth, window.innerHeight);
                lensingPass.uniforms.aspectRatio.value = window.innerWidth / window.innerHeight;
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            }, 150);
        };
        window.addEventListener('resize', onResize);

        // --- Animation Loop ---
        const clock = new THREE.Clock();
        const blackHoleScreenPosVec3 = new THREE.Vector3();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            const deltaTime = clock.getDelta();

            // Apply mouse parallax to camera rig
            const targetRotationX = mouse.y * 0.1;
            const targetRotationY = mouse.x * 0.1;
            cameraRig.rotation.x += (targetRotationX - cameraRig.rotation.x) * 0.05;
            cameraRig.rotation.y += (targetRotationY - cameraRig.rotation.y) * 0.05;

            // ++ REPLACED PARTICLE LOGIC ++
            
            // Get all particle attributes
            const positions = particleGeometry.attributes.position.array;
            const orbitalSpeeds = particleGeometry.attributes.orbitalSpeed.array;
            const orbitOffsets = particleGeometry.attributes.orbitOffset.array;
            
            // --- Calculate mouse distance from black hole (for speed) ---
            const mouseX_01 = (mouse.x + 1) / 2; // Mouse X from 0 to 1
            const mouseY_01 = (mouse.y + 1) / 2; // Mouse Y from 0 to 1
            const bhPos = lensingPass.uniforms.blackHoleScreenPos.value;
            
            // Calculate distance, correcting for screen aspect ratio
            const dx = (mouseX_01 - bhPos.x) * camera.aspect;
            const dy = mouseY_01 - bhPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // --- Map distance to follow-speed ---
            const minLerp = 0.005; // Very slow when close
            const maxLerp = 0.08;  // Faster when far
            const proximityThreshold = 0.4; // How "far" is far (in screen space)
            
            // speedFactor is 0.0 when close, 1.0 when far
            const speedFactor = THREE.MathUtils.smoothstep(dist, 0.05, proximityThreshold);
            // lerpFactor is the final interpolation speed
            const lerpFactor = THREE.MathUtils.lerp(minLerp, maxLerp, speedFactor);

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                // --- 1. Calculate Base Orbital Position ---
                const orbitalSpeed = orbitalSpeeds[i];
                const orbitOffset = orbitOffsets[i];
                const angle = orbitalSpeed * elapsedTime + orbitOffset;
                const cosA = Math.cos(angle);
                const sinA = Math.sin(angle);

                const ix = particleInitialPositions[i3];
                const iy = particleInitialPositions[i3 + 1];
                const iz = particleInitialPositions[i3 + 2];

                // Rotate the initial position around the Y-axis
                const orbitedX = ix * cosA + iz * sinA;
                const orbitedY = iy;
                const orbitedZ = -ix * sinA + iz * cosA;

                // --- 2. Calculate Mouse Parallax Offset ---
                // Use initial Z (iz) for a consistent depth effect
                const depthFactor = (iz + particleSpread / 2) / particleSpread; // 0 to 1
                const movementScale = 15 * depthFactor;
                
                const offsetX = mouse.x * movementScale;
                const offsetY = mouse.y * movementScale;
                
                // --- 3. Define Final Target Position ---
                const targetX = orbitedX + offsetX;
                const targetY = orbitedY + offsetY;
                const targetZ = orbitedZ; // Z position is controlled by orbit

                // --- 4. Interpolate to Target using new lerpFactor ---
                positions[i3] += (targetX - positions[i3]) * lerpFactor;
                positions[i3 + 1] += (targetY - positions[i3 + 1]) * lerpFactor;
                positions[i3 + 2] += (targetZ - positions[i3 + 2]) * lerpFactor;
            }
            particleGeometry.attributes.position.needsUpdate = true;
            // ++ END OF REPLACEMENT ++

            // Update uniforms
            diskMaterial.uniforms.uTime.value = elapsedTime;
            starMaterial.uniforms.uTime.value = elapsedTime;
            particleMaterial.uniforms.uTime.value = elapsedTime;
            eventHorizonMat.uniforms.uTime.value = elapsedTime;
            
            const cameraWorldPos = new THREE.Vector3();
            camera.getWorldPosition(cameraWorldPos);
            eventHorizonMat.uniforms.uCameraPosition.value.copy(cameraWorldPos);

            // Update lensing position
            blackHoleScreenPosVec3.copy(blackHoleMesh.position).project(camera);
            lensingPass.uniforms.blackHoleScreenPos.value.set(
                (blackHoleScreenPosVec3.x + 1) / 2,
                (blackHoleScreenPosVec3.y + 1) / 2
            );

            controls.update();
            stars.rotation.y += deltaTime * 0.003;
            stars.rotation.x += deltaTime * 0.001;
            accretionDisk.rotation.z += deltaTime * 0.005;

            composer.render(deltaTime);
        };
        animate();

        // --- Cleanup ---
        return () => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(infoTimer);
            clearTimeout(resizeTimeout);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }

            // Dispose of all Three.js objects
            scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        if (typeof object.material.dispose === 'function') {
                            object.material.dispose();
                        }
                    }
                }
            });
            starGeometry.dispose();
            starMaterial.dispose();
            particleGeometry.dispose();
            particleMaterial.dispose();
            eventHorizonGeom.dispose();
            eventHorizonMat.dispose();
            blackHoleGeom.dispose();
            blackHoleMat.dispose();
            diskGeometry.dispose();
            diskMaterial.dispose();
            
            composer.dispose();
            bloomPass.dispose();
            lensingPass.dispose();
            renderer.dispose();
            controls.dispose();
        };
    }, [autoRotate]);

    // --- UI Button Handler ---
    const handleToggleAutoRotate = () => {
        const newAutoRotateState = !autoRotate;
        setAutoRotate(newAutoRotateState);
        if (controlsRef.current) {
            controlsRef.current.autoRotate = newAutoRotateState;
        }
    };

    // --- JSX to Render ---
    return (
        <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100vw',
            height: '100vh', 
            zIndex: -1, 
            overflow: 'hidden',
            background: 'radial-gradient(ellipse at center, #1e1e1e 0%, #1e1e1e 70%)',
            fontFamily: "'Inter', sans-serif",
            color: '#e0e0ff'
        }}>
            <div ref={mountRef} />
            
            <div id="info" style={{ 
                position: 'absolute',
                top: '20px',
                width: '100%',
                textAlign: 'center',
                color: 'rgba(220, 220, 255, 0.9)',
                fontSize: '18px',
                letterSpacing: '0.5px',
                pointerEvents: 'none',
                zIndex: 100,
                textShadow: '0 1px 5px rgba(0, 0, 0, 0.7)',
                opacity: infoVisible ? 1 : 0, 
                transition: 'opacity 2s ease-in-out' 
            }}>
            </div>
            
            <div id="controls" className="ui-panel" style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                zIndex: 50
            }}>
                <div id="autoRotateToggle" title="Toggle automatic rotation" onClick={handleToggleAutoRotate} style={{
                    cursor: 'pointer', 
                    padding: '8px 5px', 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '8px', 
                    color: 'inherit', 
                    fontSize: 'inherit', 
                    transition: 'color 0.2s ease'
                }}>
                </div>
            </div>
        </div>
    );
};

export default BlackHoleBackground;