import Sketch from "../Sketch.js";
import EventEmitter from "./EventEmitter.js";

export default class Sizes extends EventEmitter {
  constructor() {
    super();

    this.sketch = new Sketch();

    this.width = this.sketch.targetElement.clientWidth;
    this.height = this.sketch.targetElement.clientHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    window.addEventListener("resize", () => {
      this.trigger("resize");

      this.width = this.sketch.targetElement.clientWidth;
      this.height = this.sketch.targetElement.clientHeight;
    });
  }
}
