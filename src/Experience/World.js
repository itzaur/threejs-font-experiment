import * as THREE from "three";
import Experience from "./Experience";
import Environment from "./Environment";

export default class World {
  constructor() {
    this.experience = new Experience();

    this.scene = this.experience.scene;

    this.environment = new Environment();
    this.fontLoader = this.environment.fontLoader;

    //Font config
    this.config = {
      text: "Font experiment",
      textSize: 19,
      amount: 500,
    };

    this.loadFont().then(() => {
      console.log("done");
    });
  }

  loadFont() {
    return new Promise((resolve) => {
      this.fontLoader.load(
        "fonts/Orbitron_Bold.json",
        (font) => {
          console.log("font loaded");

          let shapes = font.generateShapes(
            this.config.text,
            this.config.textSize
          );

          let geometry = new THREE.ShapeGeometry(shapes);

          geometry.computeBoundingBox();

          geometry.center();

          let material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            transparent: true,
            side: 2,
          });

          let text = new THREE.Mesh(geometry, material);

          this.scene.add(text);
        },
        function (xhr) {
          console.log(xhr);
        },
        function (error) {
          console.log(error);
        }
      );
      resolve();
    });
  }
}
