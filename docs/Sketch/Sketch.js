import * as THREE from "three";

import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import World from "./World.js";

let instance = null;

export default class Sketch {
  constructor(options = {}) {
    if (instance) return instance;
    instance = this;

    this.targetElement = options.targetElement;

    this.sizes = new Sizes();
    this.time = new Time();

    // this.sizes.on("resize", () => {
    //   this.resize();
    // });

    // this.time.on("tick", () => {
    //   this.update();
    // });
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createWorld();

    this.world.loadFont().then(() => {
      this.sizes.on("resize", () => {
        this.resize();
      });

      this.time.on("tick", () => {
        this.update();
      });
    });
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new Camera();
  }

  createRenderer() {
    this.renderer = new Renderer();
    // this.targetElement.appendChild(this.renderer.instance.domElement);
  }

  createWorld() {
    this.world = new World();
  }

  update() {
    this.camera.update();
    this.renderer.update();
    this.world.update();
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }
}
