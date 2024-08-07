export class CanvasHolder {
    constructor(element, width, height) {
        this.canvas = document.querySelector(element);
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
    }

    getContext() {
        return this.context;
    }

    getCanvas() {
        return this.canvas;
    }

    //TODO закончить рефактор
    setupCanvas(color, size, caps) {

    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}