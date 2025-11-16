// src/components/BlackHoleBackground/BlackHoleScene.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// Import our constants and shaders
import { BLACK_HOLE_RADIUS, DISK_INNER_RADIUS, DISK_OUTER_RADIUS, DISK_TILT_ANGLE } from './constants.js';
import { lensingShader } from './shaders/lensingShader.js';
import { starMaterialShader } from './shaders/starShader.js';
import { particleShader } from './shaders/particleShader.js';
import { eventHorizonShader } from './shaders/eventHorizonShader.js';
import { diskShader } from './shaders/diskShader.js';

export class BlackHoleScene {
    constructor(mountElement) {
        if (!mountElement) {
            console.error("BlackHoleScene requires a mount element.");
            return;
        }
        this.mount = mountElement;
        this.mouse = new THREE.Vector2(0, 0);
        this.blackHoleScreenPosVec3 = new THREE.Vector3(-8,0,0);
        this.clock = new THREE.Clock();

        // Bind methods
        this.init = this.init.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.animate = this.animate.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onResize = this.onResize.bind(this);
        this.cleanup = this.cleanup.bind(this);
    }

    init() {
        // --- Scene Setup ---
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x020104, 0.025);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 4000);
        this.camera.position.set(-8.5, 5.5, 6.5);

        this.cameraRig = new THREE.Group();
        this.cameraRig.add(this.camera);
        this.scene.add(this.cameraRig);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.mount.appendChild(this.renderer.domElement);

        // --- Post-processing ---
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 0.7, 0.8
        );
        this.composer.addPass(this.bloomPass);

        this.lensingPass = new ShaderPass(lensingShader);
        this.composer.addPass(this.lensingPass);

        // --- Controls ---
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; this.controls.dampingFactor = 0.035;
        this.controls.rotateSpeed = 0.4; this.controls.autoRotate = false; // Will be controlled by React state
        this.controls.autoRotateSpeed = 0.1;
        this.controls.target.set(-7.5, 0, 0);
        this.controls.minDistance = 2.5;
        this.controls.maxDistance = 100;
        this.controls.enablePan = false;
        this.controls.update();

        // --- Starfield ---
        this.starGeometry = new THREE.BufferGeometry();
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
        this.starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        this.starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        this.starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
        this.starGeometry.setAttribute('twinkle', new THREE.BufferAttribute(starTwinkle, 1));

        this.starMaterial = new THREE.ShaderMaterial({
            ...starMaterialShader,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        this.stars = new THREE.Points(this.starGeometry, this.starMaterial);
        this.scene.add(this.stars);

        // --- 3D Particles System ---
        const particleCount = 500;
        this.particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        this.particleInitialPositions = new Float32Array(particleCount * 3); // Store initial
        const particleColors = new Float32Array(particleCount * 3);
        const particleSizes = new Float32Array(particleCount);
        const particleSpeeds = new Float32Array(particleCount);
        const particleOrbitalSpeeds = new Float32Array(particleCount);
        const particleOrbitOffsets = new Float32Array(particleCount);
        
        const particlePalette = [
            new THREE.Color(0xfff5e6), new THREE.Color(0xfef9ef), new THREE.Color(0xfff0f5),
            new THREE.Color(0xf0f8ff), new THREE.Color(0xfffacd), new THREE.Color(0xfaf0e6),
            new THREE.Color(0xfff5ee), new THREE.Color(0xf5f5f5),
        ];
        const particleSpread = 50;

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const x = (Math.random() - 0.5) * particleSpread;
            const y = (Math.random() - 0.5) * particleSpread;
            const z = (Math.random() - 0.5) * particleSpread;
            
            particlePositions[i3] = x;
            particlePositions[i3 + 1] = y;
            particlePositions[i3 + 2] = z;
            
            this.particleInitialPositions[i3] = x;
            this.particleInitialPositions[i3 + 1] = y;
            this.particleInitialPositions[i3 + 2] = z;

            const particleColor = particlePalette[Math.floor(Math.random() * particlePalette.length)].clone();
            particleColor.multiplyScalar(Math.random() * 0.15 + 0.85);
            particleColors[i3] = particleColor.r;
            particleColors[i3 + 1] = particleColor.g;
            particleColors[i3 + 2] = particleColor.b;

            particleSizes[i] = THREE.MathUtils.randFloat(2.0, 6.0);
            particleSpeeds[i] = THREE.MathUtils.randFloat(1.0, 3.0);
            particleOrbitalSpeeds[i] = THREE.MathUtils.randFloat(0.05, 0.2);
            particleOrbitOffsets[i] = Math.random() * Math.PI * 2;
        }

        this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
        this.particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
        this.particleGeometry.setAttribute('speed', new THREE.BufferAttribute(particleSpeeds, 1));
        this.particleGeometry.setAttribute('orbitalSpeed', new THREE.BufferAttribute(particleOrbitalSpeeds, 1));
        this.particleGeometry.setAttribute('orbitOffset', new THREE.BufferAttribute(particleOrbitOffsets, 1));

        this.particleMaterial = new THREE.ShaderMaterial({
            ...particleShader,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);
        this.scene.add(this.particles);

        // --- Event Horizon ---
        this.eventHorizonGeom = new THREE.SphereGeometry(BLACK_HOLE_RADIUS * 1.05, 128, 64);
        this.eventHorizonMat = new THREE.ShaderMaterial({
            ...eventHorizonShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });
        this.eventHorizon = new THREE.Mesh(this.eventHorizonGeom, this.eventHorizonMat);
        this.scene.add(this.eventHorizon);

        // --- Black Hole Sphere ---
        this.blackHoleGeom = new THREE.SphereGeometry(BLACK_HOLE_RADIUS, 128, 64);
        this.blackHoleMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        this.blackHoleMesh = new THREE.Mesh(this.blackHoleGeom, this.blackHoleMat);
        this.blackHoleMesh.renderOrder = 0;
        this.scene.add(this.blackHoleMesh);

        // --- Accretion Disk ---
        this.diskGeometry = new THREE.RingGeometry(DISK_INNER_RADIUS, DISK_OUTER_RADIUS, 256, 128);
        this.diskMaterial = new THREE.ShaderMaterial({
            ...diskShader,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        this.accretionDisk = new THREE.Mesh(this.diskGeometry, this.diskMaterial);
        this.accretionDisk.rotation.x = DISK_TILT_ANGLE;
        this.accretionDisk.renderOrder = 1;
        this.scene.add(this.accretionDisk);

        // --- Add Event Listeners ---
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('resize', this.onResize);
    }

    start() {
        if (!this.animationFrameId) {
            this.animate();
        }
    }

    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.cleanup();
    }

    animate() {
        this.animationFrameId = requestAnimationFrame(this.animate);
        const elapsedTime = this.clock.getElapsedTime();
        const deltaTime = this.clock.getDelta();

        // Mouse parallax
        const targetRotationX = this.mouse.y * 0.1;
        const targetRotationY = this.mouse.x * 0.1;
        this.cameraRig.rotation.x += (targetRotationX - this.cameraRig.rotation.x) * 0.05;
        this.cameraRig.rotation.y += (targetRotationY - this.cameraRig.rotation.y) * 0.05;

        // Particle logic
        const positions = this.particleGeometry.attributes.position.array;
        const orbitalSpeeds = this.particleGeometry.attributes.orbitalSpeed.array;
        const orbitOffsets = this.particleGeometry.attributes.orbitOffset.array;
        const particleCount = this.particles.geometry.attributes.position.count;
        const particleSpread = 50; // Must match init value
        
        const mouseX_01 = (this.mouse.x + 1) / 2;
        const mouseY_01 = (this.mouse.y + 1) / 2;
        const bhPos = this.lensingPass.uniforms.blackHoleScreenPos.value;
        
        const dx = (mouseX_01 - bhPos.x) * this.camera.aspect;
        const dy = mouseY_01 - bhPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const minLerp = 0.005;
        const maxLerp = 0.08;
        const proximityThreshold = 0.4;
        
        const speedFactor = THREE.MathUtils.smoothstep(dist, 0.05, proximityThreshold);
        const lerpFactor = THREE.MathUtils.lerp(minLerp, maxLerp, speedFactor);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            const orbitalSpeed = orbitalSpeeds[i];
            const orbitOffset = orbitOffsets[i];
            const angle = orbitalSpeed * elapsedTime + orbitOffset;
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            const ix = this.particleInitialPositions[i3];
            const iy = this.particleInitialPositions[i3 + 1];
            const iz = this.particleInitialPositions[i3 + 2];

            const orbitedX = ix * cosA + iz * sinA;
            const orbitedY = iy;
            const orbitedZ = -ix * sinA + iz * cosA;

            const depthFactor = (iz + particleSpread / 2) / particleSpread;
            const movementScale = 15 * depthFactor;
            
            const offsetX = this.mouse.x * movementScale;
            const offsetY = this.mouse.y * movementScale;
            
            const targetX = orbitedX + offsetX;
            const targetY = orbitedY + offsetY;
            const targetZ = orbitedZ;

            positions[i3] += (targetX - positions[i3]) * lerpFactor;
            positions[i3 + 1] += (targetY - positions[i3 + 1]) * lerpFactor;
            positions[i3 + 2] += (targetZ - positions[i3 + 2]) * lerpFactor;
        }
        this.particleGeometry.attributes.position.needsUpdate = true;

        // Update uniforms
        this.diskMaterial.uniforms.uTime.value = elapsedTime;
        this.starMaterial.uniforms.uTime.value = elapsedTime;
        this.particleMaterial.uniforms.uTime.value = elapsedTime;
        this.eventHorizonMat.uniforms.uTime.value = elapsedTime;
        
        const cameraWorldPos = new THREE.Vector3();
        this.camera.getWorldPosition(cameraWorldPos);
        this.eventHorizonMat.uniforms.uCameraPosition.value.copy(cameraWorldPos);

        // Update lensing position
        this.blackHoleScreenPosVec3.copy(this.blackHoleMesh.position).project(this.camera);
        this.lensingPass.uniforms.blackHoleScreenPos.value.set(
            (this.blackHoleScreenPosVec3.x + 1) / 2,
            (this.blackHoleScreenPosVec3.y + 1) / 2
        );

        this.controls.update();
        this.stars.rotation.y += deltaTime * 0.003;
        this.stars.rotation.x += deltaTime * 0.001;
        this.accretionDisk.rotation.z += deltaTime * 0.005;

        this.composer.render(deltaTime);
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            if (!this.camera || !this.renderer || !this.composer || !this.bloomPass || !this.lensingPass) return;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.composer.setSize(window.innerWidth, window.innerHeight);
            this.bloomPass.resolution.set(window.innerWidth, window.innerHeight);
            this.lensingPass.uniforms.aspectRatio.value = window.innerWidth / window.innerHeight;
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        }, 150);
    }

    // Public method for React to control
    setAutoRotate(isAutoRotating) {
        if (this.controls) {
            this.controls.autoRotate = isAutoRotating;
        }
    }

    cleanup() {
        // Remove event listeners
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('resize', this.onResize);
        clearTimeout(this.resizeTimeout);

        // Remove DOM element
        if (this.mount && this.renderer && this.mount.contains(this.renderer.domElement)) {
            this.mount.removeChild(this.renderer.domElement);
        }

        // Dispose of all Three.js objects
        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else if (typeof object.material.dispose === 'function') {
                        object.material.dispose();
                    }
                }
            });
        }

        // Explicitly dispose of geometries and materials
        this.starGeometry?.dispose();
        this.starMaterial?.dispose();
        this.particleGeometry?.dispose();
        this.particleMaterial?.dispose();
        this.eventHorizonGeom?.dispose();
        this.eventHorizonMat?.dispose();
        this.blackHoleGeom?.dispose();
        this.blackHoleMat?.dispose();
        this.diskGeometry?.dispose();
        this.diskMaterial?.dispose();
        
        // Dispose of post-processing and renderer
        this.composer?.dispose();
        this.bloomPass?.dispose();
        this.lensingPass?.dispose();
        this.renderer?.dispose();
        this.controls?.dispose();
    }
}