// src/components/BlackHoleBackground.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BlackHoleBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 150;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Black hole core
    const coreGeometry = new THREE.SphereGeometry(12, 64, 64);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.position.x = 25;
    scene.add(core);

    // Event horizon glow
    const glowGeometry = new THREE.SphereGeometry(14, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.4,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.x = 25;
    scene.add(glow);

    // Accretion disk
    const diskGeometry = new THREE.TorusGeometry(22, 4, 32, 200);
    const diskMaterial = new THREE.MeshPhongMaterial({
      color: 0xffcc00,
      emissive: 0xff9900,
      shininess: 100,
      transparent: true,
      opacity: 0.7,
    });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.rotation.x = Math.PI / 2;
    disk.position.x = 25;
    scene.add(disk);

    // Photon ring
    const ringGeometry = new THREE.TorusGeometry(16, 0.8, 32, 200);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff66,
      transparent: true,
      opacity: 0.9,
    });
    const photonRing = new THREE.Mesh(ringGeometry, ringMaterial);
    photonRing.rotation.x = Math.PI / 2;
    photonRing.position.x = 25;
    scene.add(photonRing);

    // 3D orbital particles
    const particlesCount = 1200;
    const positions = new Float32Array(particlesCount * 3);
    const angles = new Float32Array(particlesCount);
    const radii = new Float32Array(particlesCount);
    const inclinations = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      const radius = 40 + Math.random() * 150; // distance from black hole
      const angle = Math.random() * Math.PI * 2; // longitude
      const inclination = (Math.random() - 0.5) * Math.PI / 4; // tilt angle

      radii[i] = radius;
      angles[i] = angle;
      inclinations[i] = inclination;

      positions[i * 3] = 25 + Math.cos(angle) * radius * Math.cos(inclination);
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = Math.cos(angle) * radius * Math.sin(inclination);
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Mouse interaction
    const mouse = { x: 0 };
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / width) * 2 - 1; // -1 left, +1 right
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate glow, disk, photon ring slowly
      glow.rotation.y += 0.001;
      disk.rotation.z += 0.002;
      photonRing.rotation.z += 0.003;

      // Update particle positions (3D orbital motion)
      const pos = particlesGeometry.attributes.position.array;
      for (let i = 0; i < particlesCount; i++) {
        const baseSpeed = 0.001 + (200 - radii[i]) * 0.00002;
        const speed = baseSpeed + mouse.x * 0.002; // mouse modifies direction

        angles[i] += speed;

        pos[i * 3] = 25 + Math.cos(angles[i]) * radii[i] * Math.cos(inclinations[i]);
        pos[i * 3 + 1] = Math.sin(angles[i]) * radii[i];
        pos[i * 3 + 2] = Math.cos(angles[i]) * radii[i] * Math.sin(inclinations[i]);
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div className="blackhole-canvas" ref={mountRef}></div>;
};

export default BlackHoleBackground;
