import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';

const BackgroundCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 }
      }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll);

    let clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      material.uniforms.time.value = clock.getElapsedTime() + scrollY * 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('scroll', onScroll);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="canvas-container" ref={mountRef}></div>;
};

export default BackgroundCanvas;
