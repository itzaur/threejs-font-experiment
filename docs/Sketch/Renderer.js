import * as THREE from "three";

import Sketch from "./Sketch.js";

export default class Renderer {
  constructor() {
    this.sketch = new Sketch();

    this.scene = this.sketch.scene;
    this.sizes = this.sketch.sizes;
    this.camera = this.sketch.camera;
    this.container = this.sketch.targetElement;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    this.instance.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.instance.domElement);
  }

  update() {
    this.instance.render(this.scene, this.camera.instance);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }
}
