//TODO закончить рефактор
export class CanvasHolder {
    /**
     * @param {string} element - element to pass to querySelector
     * @param {number} width - width of canvas 
     * @param {number} height - height of canvas  
     */
    constructor(element, width, height) {
        this.canvas = document.querySelector(element);
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
    }

    /**
     * @returns {CanvasRenderingContext2D} 
     */
    getContext() {
        return this.context;
    }

    /**
     * @returns {HTMLCanvasElement}
     */
    getCanvas() {
        return this.canvas;
    }

    /**
     * @param {string} color 
     * @param {number} size 
     * @param {string} cap 
     * @param {string} join 
     * @returns {CanvasRenderingContext2D}
     */
    setupCanvas(color, size, cap, join) {
        this.context.strokeStyle = color;
        this.context.lineWidth = size;
        this.context.lineCap = cap;
        this.context.lineJoin = join;
        return this.context;
    }

    /**
     * @param {string} color 
     */
    setColor(color) {
        this.context.strokeStyle = color;
    }

    /**
     * @param {number} size 
     */
    setSize(size) {
        this.context.lineWidth = size;
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}