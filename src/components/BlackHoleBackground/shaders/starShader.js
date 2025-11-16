// src/components/BlackHoleBackground/shaders/starShader.js
export const starMaterialShader = {
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