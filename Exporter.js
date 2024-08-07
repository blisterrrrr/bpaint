export class Exporter {
    constructor(canvasHolder) {
        this.story = [];
        this.index = -1;
        this.holder = canvasHolder;
    }

    getImgData() {
        const width = this.holder.canvas.width;
        const height = this.holder.canvas.height;
        return this.holder.getContext().getImageData(0, 0, width, height);
    }

    add() {
        this.story.push(this.getImgData());
        this.index += 1;
    }

    reset() {
        this.story = [];
        this.index = -1;
    }

    pop() {
        if (this.index <= -1) {
            throw new Error("Trying to undo empty history")
        }
        this.index -= 1;
        this.story.pop();
        if (this.index === -1) {
            this.holder.clearCanvas();
            return;
        }
        this.holder.getContext().putImageData(this.story[this.index], 0, 0);
    }

    dbgPrint() {
        console.log(this.story);
        console.log(this.index);
    }
}