import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Sketch from "./Sketch.js";

export default class Camera {
  constructor() {
    this.sketch = new Sketch();

    this.container = this.sketch.targetElement;

    this.sizes = this.sketch.sizes;

    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      1000
    );
    this.instance.position.set(0, 0, 100);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.container);
    this.controls.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
