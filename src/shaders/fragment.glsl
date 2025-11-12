uniform float time;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float dist = distance(uv, vec2(0.5));
  float ring = smoothstep(0.4, 0.5, dist) - smoothstep(0.5, 0.6, dist);
  vec3 color = mix(vec3(0.0), vec3(1.0, 0.5, 0.0), ring);
  gl_FragColor = vec4(color, 1.0);
}
