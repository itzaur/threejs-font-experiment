import Experience from "../Experience";
import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter {
  constructor() {
    super();

    this.experience = new Experience();

    this.width = this.experience.targetElement.clientWidth;
    this.height = this.experience.targetElement.clientHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    window.addEventListener("resize", () => {
      this.trigger("resize");

      this.width = this.experience.targetElement.clientWidth;
      this.height = this.experience.targetElement.clientHeight;
    });
  }
}
