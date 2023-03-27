import * as THREE from "three";

import Experience from "./Experience";

export default class Renderer {
  constructor() {
    this.experience = new Experience();

    this.scene = this.experience.scene;
    this.container = this.experience.targetElement;
    this.sizes = this.experience.sizes;
    this.camera = this.experience.camera;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.aspectRatio);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
