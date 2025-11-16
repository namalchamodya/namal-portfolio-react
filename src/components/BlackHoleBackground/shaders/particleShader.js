// src/components/BlackHoleBackground/shaders/particleShader.js
export const particleShader = {
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