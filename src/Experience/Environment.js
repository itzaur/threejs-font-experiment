import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import Experience from "./Experience";

export default class Environment {
  constructor() {
    this.experience = new Experience();

    this.scene = this.experience.scene;

    // //Font config
    // this.config = {
    //   text: "Font experiment",
    //   textSize: 20,
    //   amount: 500,
    // };

    this.setLights();
    this.createLoaders();
    // this.loadFont().then(() => {
    //   console.log("done");
    // });
  }

  setLights() {
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    this.directionalLight.position.set(1, 1, 1);
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.camera.far = 15;

    this.scene.add(this.directionalLight);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.ambientLight.position.set(1, 1, 2);
    this.scene.add(this.ambientLight);
  }

  createLoaders() {
    this.loadingManager = new THREE.LoadingManager();
    this.fontLoader = new FontLoader(this.loadingManager);
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager);
  }

  //   loadFont() {
  //     return new Promise((resolve) => {
  //       this.fontLoader.load(
  //         "fonts/Orbitron_Bold.json",
  //         (font) => {
  //           console.log("font loaded");

  //           let shapes = font.generateShapes(
  //             this.config.text,
  //             this.config.textSize
  //           );

  //           let geometry = new THREE.ShapeGeometry(shapes);

  //           geometry.computeBoundingBox();

  //           geometry.center();

  //           let material = new THREE.MeshStandardMaterial({
  //             color: 0xff0000,
  //             transparent: true,
  //             side: 2,
  //           });

  //           let text = new THREE.Mesh(geometry, material);

  //           this.scene.add(text);
  //         },
  //         function (xhr) {
  //           console.log(xhr);
  //         },
  //         function (error) {
  //           console.log(error);
  //         }
  //       );
  //       resolve();
  //     });
  //   }
}
