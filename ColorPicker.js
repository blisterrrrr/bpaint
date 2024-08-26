export class ColorPicker {
  constructor(query, width, height, indicator) {
    this.canvas = document.querySelector(query);
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext("2d");
    this.circle = {
      x: 5,
      y: 5,
      radius: 5,
    }
    this.indicator = document.querySelector(indicator);
  }

  /**
   * 
   * @param {Function | Function[]} callback 
   */
  setup(callback) {
    this.callbacks = callback;
    return this;
  }

  gradInit() {
    let gradient = this.context.createLinearGradient(0, 0, this.canvas.width, 0);
    gradient.addColorStop(0, "rgb(255, 0 , 0)");
    gradient.addColorStop(0.15, "rgb(255, 0, 255)");
    gradient.addColorStop(0.33, "rgb(0, 0, 255)");
    gradient.addColorStop(0.49, "rgb(0, 255, 255)");
    gradient.addColorStop(0.67, "rgb(0, 255, 0)");
    gradient.addColorStop(0.84, "rgb(255, 255, 0)");
    gradient.addColorStop(1, "rgb(255, 0, 0)");
    this.context.fillStyle = gradient;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    gradient = this.context.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
    this.context.fillStyle = gradient;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  circleInit() {
    this.context.strokeStyle = "black";
    this.context.beginPath();
    this.context.arc(this.circle.x, this.circle.y, this.circle.radius, 0, Math.PI * 2);
    this.context.stroke();
    this.context.closePath();
  }

  init() {
    this.listenToEvents();
    setInterval(() => {
      this.gradInit();
      this.circleInit();
    }, 200)
  }

  getColor() {
    const imgData = this.context.getImageData(this.circle.x, this.circle.y, 1, 1);
    return this.rgbToHex(imgData.data[0], imgData.data[1], imgData.data[2]);
  }

  listenToEvents() {
    let isDown = false;
    const mouseDown = (e) => {
      const currX = e.clientX - this.canvas.offsetLeft;
      const currY = e.clientY - this.canvas.offsetTop;
      if (currY > this.circle.y &&
          currY < this.circle.y + this.circle.radius &&
          currX > this.circle.x &&
          currX < this.circle.x + this.circle.radius
      ) {
        isDown = true;
      } else {
        this.circle.x = currX;
        this.circle.y = currY;
        isDown = true;
      }
    }

    const mouseMove = (e) => {
      if (!isDown) return;
      const currX = e.clientX - this.canvas.offsetLeft;
      const currY = e.clientY - this.canvas.offsetTop;
      this.circle.x = currX;
      this.circle.y = currY;
    }

    const mouseUp = (e) => {
      isDown = false;
    }

    this.canvas.addEventListener("mousedown", mouseDown);
    this.canvas.addEventListener("mousemove", mouseMove);
    this.canvas.addEventListener("mouseup", mouseUp);
    this.canvas.addEventListener("mouseout", mouseUp);
    this.canvas.addEventListener("mousemove", () => {
      if (!isDown) return;
      const color = this.getColor();
      this.indicator.style.backgroundColor = color;
      if (typeof this.callbacks === 'function') {
        this.callbacks(color);
      } else {
        this.callbacks.forEach((callback) => callback(color));
      }
    });
  }

  numToHex(num) {
    const hex = num.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }

  rgbToHex(r, g, b) {
    return '#' + this.numToHex(r) + this.numToHex(g) + this.numToHex(b);
  }
}
