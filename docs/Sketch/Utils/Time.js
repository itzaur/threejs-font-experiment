import EventEmitter from "./EventEmitter.js";

export default class Time extends EventEmitter {
  constructor() {
    super();

    this.start = Date.now();
    this.current = this.start;
    this.delta = 16;
    this.elapsed = 0;

    window.requestAnimationFrame(this.tick.bind(this));
  }

  tick() {
    this.trigger("tick");

    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    window.requestAnimationFrame(this.tick.bind(this));
  }
}
