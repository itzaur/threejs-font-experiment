import * as THREE from "three";

import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import World from "./World.js";

let instance = null;

export default class Experience {
  constructor(options = {}) {
    //Global access
    window.experience = this;

    if (instance) return instance;
    instance = this;

    //Options
    this.targetElement = options.targetElement;

    //Setup
    this.sizes = new Sizes();
    this.time = new Time();

    this.sizes.on("resize", this.resize.bind(this));
    this.time.on("tick", this.update.bind(this));
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createWorld();

    // this.createMesh();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new Camera();
  }

  createRenderer() {
    this.renderer = new Renderer();
    this.targetElement.appendChild(this.renderer.instance.domElement);
  }

  createWorld() {
    this.world = new World();
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.renderer.update();
  }
}
