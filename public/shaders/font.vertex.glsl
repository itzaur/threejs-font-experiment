attribute vec3 customColor;
attribute float size;

varying vec2 vUv;

varying vec3 vColor;

void main() {
    vColor = customColor;
    vec4 mvPosition = vec4(position, 1.0);
    vec4 pos = modelViewMatrix * mvPosition;
    gl_PointSize = size * (300.0 / -pos.z);
    gl_Position = projectionMatrix * pos;

}