precision mediump float;

uniform sampler2D uTexture;
uniform vec3 uColor;

varying vec2 vUv;
varying vec3 vColor;

void main() {
    // vec4 texture = texture2D(uTexture, vUv);
    gl_FragColor = vec4(uColor * vColor, 2.0);
    gl_FragColor = gl_FragColor * texture2D(uTexture, gl_PointCoord);
    // gl_FragColor += vec4(1.0, 0.5, 0.0, 1.0);
}