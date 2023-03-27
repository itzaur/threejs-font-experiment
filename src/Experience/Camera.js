import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Experience from "./Experience";

export default class Camera {
  constructor() {
    this.experience = new Experience();

    this.scene = this.experience.scene;
    this.container = this.experience.targetElement;

    this.sizes = this.experience.sizes;

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
