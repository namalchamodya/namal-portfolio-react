// src/components/BlackHoleBackground/shaders/eventHorizonShader.js
import * as THREE from 'three';

export const eventHorizonShader = {
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