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

    test() {
        console.log(this.context)
    }
}