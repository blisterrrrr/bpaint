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
    setupCanvas(color, size, cap, join) {
        this.context.strokeStyle = color;
        this.context.lineWidth = size;
        this.context.lineCap = cap;
        this.context.lineJoin = join;
        return this.context;
    }

    setColor(color) {
        this.context.strokeStyle = color;
    }

    setSize(size) {
        this.context.lineWidth = size;
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}