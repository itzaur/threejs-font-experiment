import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

import Sketch from "./Sketch.js";
import fragmentShader from "../../public/shaders/font.fragment.glsl";
import vertexShader from "../../public/shaders/font.vertex.glsl";

export default class World {
  constructor() {
    this.sketch = new Sketch();

    this.scene = this.sketch.scene;
    this.camera = this.sketch.camera;
    this.sizes = this.sketch.sizes;

    this.config = {
      text: "Font experiment",
      amount: 500,
      textSize: 20,
      color: 0xff0500,
      particleSize: 1.2,
      area: 150,
      ease: 0.05,
    };
    this.colorChange = new THREE.Color();
    this.buttom = false;
    this.material = null;

    this.createLoaders();
    this.createRaycaster();
    this.createPlaneArea();
    // this.textAnimation();
    // this.mouseMove = (e) => this.onMouseMove(e);

    this.mouseMoveEvent();
  }

  createLoaders() {
    this.loadingManager = new THREE.LoadingManager();
    this.fontLoader = new FontLoader(this.loadingManager);
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
  }

  loadFont() {
    return new Promise((resolve) => {
      this.particleTexture = this.textureLoader.load(
        "https://res.cloudinary.com/dfvtkoboz/image/upload/v1605013866/particle_a64uzf.png"
      );

      this.fontLoader.load(
        "/fonts/Orbitron_Bold.json",
        (font) => {
          console.log("font loaded");

          let thePoints = [];

          let shapes = font.generateShapes(
            this.config.text,
            this.config.textSize
          );

          let geometry = new THREE.ShapeGeometry(shapes);

          geometry.computeBoundingBox();

          geometry.center();

          const xMiddle =
            -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
          const yMiddle =
            (geometry.boundingBox.max.y - geometry.boundingBox.min.y) / 2.85;

          let holeShapes = [];

          for (let i = 0; i < shapes.length; i++) {
            let shape = shapes[i];

            if (shape.holes && shape.holes.length > 0) {
              for (let j = 0; j < shape.holes.length; j++) {
                let hole = shape.holes[j];
                holeShapes.push(hole);
              }
            }
          }

          shapes.push(...holeShapes);

          let colors = [];
          let sizes = [];

          for (let q = 0; q < shapes.length; q++) {
            let shape = shapes[q];

            const amountPoints =
              shape.type == "Path"
                ? this.config.amount / 2
                : this.config.amount;

            let points = shape.getSpacedPoints(amountPoints);

            points.forEach((point) => {
              const vector = new THREE.Vector3(point.x, point.y, 0);
              thePoints.push(vector);

              colors.push(
                this.colorChange.r,
                this.colorChange.g,
                this.colorChange.b
              );
              sizes.push(1);
            });
          }

          let geometryParticles = new THREE.BufferGeometry().setFromPoints(
            thePoints
          );
          geometryParticles.translate(xMiddle, yMiddle, 0);

          geometryParticles.setAttribute(
            "customColor",
            new THREE.Float32BufferAttribute(colors, 3)
          );
          geometryParticles.setAttribute(
            "size",
            new THREE.Float32BufferAttribute(sizes, 1)
          );
          // console.log(geometryParticles);

          this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            uniforms: {
              uTexture: { value: this.particleTexture },
              uColor: {
                value: new THREE.Color(this.config.color),
              },
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false,
          });
          // this.particles = new THREE.Points(geometryParticles, material);
          this.particles = new THREE.Points(geometryParticles, this.material);

          this.scene.add(this.particles);

          // this.geometryCopy = new THREE.BufferGeometry();
          // this.geometryCopy.copy(this.particles.geometry);
        },
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function (err) {
          console.log(err, "An error happened");
        }
      );

      resolve();
    });
  }

  createPlaneArea() {
    this.geometry = new THREE.PlaneGeometry(
      // this.visibleScreenWidth(100, this.camera.instance),
      // this.visibleScreenHeight(100, this.camera.instance)
      this.sizes.width,
      this.sizes.height
    );
    this.material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      wireframe: true,
    });
    this.planeArea = new THREE.Mesh(this.geometry, this.material);
    // this.scene.add(this.planeArea);
  }

  visibleScreenHeight(depth, camera) {
    const cameraOffset = camera.position.z;

    if (depth < cameraOffset) depth -= cameraOffset;
    else depth += cameraOffset;

    const vFOV = (camera.fov * Math.PI) / 180;
    return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
  }

  visibleScreenWidth(depth, camera) {
    const height = this.visibleScreenHeight(depth, camera);

    return height * camera.aspect;
  }

  createRaycaster() {
    this.mouse = new THREE.Vector2(-200, 200);

    this.raycaster = new THREE.Raycaster();
    this.intersects = [];
  }

  onMouseMove(e) {
    const x = (e.clientX / this.sizes.width) * 2 - 1;
    const y = -((e.clientY / this.sizes.height) * 2 - 1);

    this.mouse.set(x, y);
    // console.log(this.mouse);
  }

  mouseMoveEvent() {
    window.addEventListener("mousemove", this.onMouseMove.bind(this), {
      passive: true,
    });
  }

  distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  update() {
    const time = ((0.001 * performance.now()) % 12) / 12;
    const zigzagTime = (1 + Math.sin(time * 2 * Math.PI)) / 6;

    // console.log(time);
    this.raycaster.setFromCamera(this.mouse, this.camera.instance);
    this.intersects = this.raycaster.intersectObject(this.planeArea);

    if (this.intersects.length > 0) {
      // const copy = this.geometryCopy.attributes.position;
      // const { position, customColor, size } =
      //   this.particles.geometry.attributes;
      // const mx = this.intersects[0].point.x || 0;
      // const my = this.intersects[0].point.y || 0;
      // const mz = this.intersects[0].point.z || 0;
      // for (let i = 0; i < position.count; i++) {
      //   const initX = copy.getX(i);
      //   const initY = copy.getY(i);
      //   const initZ = copy.getZ(i);
      //   let px = position.getX(i);
      //   let py = position.getY(i);
      //   let pz = position.getZ(i);
      //   this.colorChange.setHSL(0.5, 1, 1);
      //   customColor.setXYZ(
      //     i,
      //     this.colorChange.r,
      //     this.colorChange.g,
      //     this.colorChange.b
      //   );
      //   customColor.needsUpdate = true;
      //   size.array[i] = this.config.particleSize;
      //   size.needsUpdate = true;
      //   ///////////
      //   let dx = mx - px;
      //   let dy = my - py;
      //   const dz = mz - pz;
      //   const mouseDistance = this.distance(mx, my, px, py);
      //   // console.log(mouseDistance);
      //   let d = (dx = mx - px) * dx + (dy = my - py) * dy;
      //   const f = -this.config.area / d;
      //   if (this.buttom) {
      //     const t = Math.atan2(dy, dx);
      //     px -= f * Math.cos(t);
      //     py -= f * Math.sin(t);
      //     this.colorChange.setHSL(0.5 + zigzagTime, 1.0, 0.5);
      //     customColor.setXYZ(
      //       i,
      //       this.colorChange.r,
      //       this.colorChange.g,
      //       this.colorChange.b
      //     );
      //     customColor.needsUpdate = true;
      //     if (
      //       px > initX + 70 ||
      //       px < initX - 70 ||
      //       py > initY + 70 ||
      //       py < initY - 70
      //     ) {
      //       this.colorChange.setHSL(0.15, 1.0, 0.5);
      //       customColor.setXYZ(
      //         i,
      //         this.colorChange.r,
      //         this.colorChange.g,
      //         this.colorChange.b
      //       );
      //       customColor.needsUpdate = true;
      //     }
      //   } else {
      //     if (mouseDistance < this.config.area) {
      //       if (i % 5 == 0) {
      //         const t = Math.atan2(dy, dx);
      //         px -= 0.03 * Math.cos(t);
      //         py -= 0.03 * Math.sin(t);
      //         this.colorChange.setHSL(0.15, 1.0, 0.5);
      //         customColor.setXYZ(
      //           i,
      //           this.colorChange.r,
      //           this.colorChange.g,
      //           this.colorChange.b
      //         );
      //         customColor.needsUpdate = true;
      //         size.array[i] = this.config.particleSize / 1.2;
      //         size.needsUpdate = true;
      //       } else {
      //         const t = Math.atan2(dy, dx);
      //         px += f * Math.cos(t);
      //         py += f * Math.sin(t);
      //         position.setXYZ(i, px, py, pz);
      //         position.needsUpdate = true;
      //         size.array[i] = this.config.particleSize * 1.3;
      //         size.needsUpdate = true;
      //       }
      //       if (
      //         px > initX + 10 ||
      //         px < initX - 10 ||
      //         py > initY + 10 ||
      //         py < initY - 10
      //       ) {
      //         this.colorChange.setHSL(0.15, 1.0, 0.5);
      //         customColor.setXYZ(
      //           i,
      //           this.colorChange.r,
      //           this.colorChange.g,
      //           this.colorChange.b
      //         );
      //         customColor.needsUpdate = true;
      //         size.array[i] = this.config.particleSize / 1.8;
      //         size.needsUpdate = true;
      //       }
      //     }
      //   }
      //   px += (initX - px) * this.config.ease;
      //   py += (initY - py) * this.config.ease;
      //   pz += (initZ - pz) * this.config.ease;
      //   position.setXYZ(i, px, py, pz);
      //   position.needsUpdate = true;
      // }
    }
  }
}
