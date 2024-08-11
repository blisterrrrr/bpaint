import {CanvasHolder} from "./canvasHolder.js"
import {Exporter} from "./Exporter.js";
import { TOOLS, Toolset } from "./Toolset.js";

const cvclass = new CanvasHolder("#canvas", 1000, 500);
const canvas = cvclass.getCanvas();
const cvctx = cvclass.setupCanvas("black", 10, "round", "round");
const ocvclass = new CanvasHolder("#overlayCanvas", 1000, 500);
const ocanvas = ocvclass.getCanvas();
const ocvctx = ocvclass.setupCanvas("red", 10, "round", "round");
let isDrawing = false;

const sizeSlider = document.querySelector("#brushSizeSlider");
const sizeLabel = document.querySelector("#brushSizeLabel");
sizeLabel.innerText = `Brush Size (${sizeSlider.value})`;
sizeSlider.addEventListener("change", (e) => {
    cvclass.setSize(e.currentTarget.value);
    ocvclass.setSize(e.currentTarget.value);
    sizeLabel.innerText = `Brush Size (${e.currentTarget.value})`;
});

const colorPicker = document.querySelector("#brushColorPicker");
colorPicker.addEventListener("change", (e) => {
    cvclass.setColor(e.currentTarget.value);
    ocvclass.setColor(e.currentTarget.value);
})

const toolSet = new Toolset().setup(TOOLS);
const toolSelector = document.querySelector("#toolSelect");
toolSelector.addEventListener('change', (e) => {
    toolSet.selectTool(e.currentTarget.value);
})

canvas.addEventListener('mousedown', start);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stop);
canvas.addEventListener('mouseout', stop);

let rectX = null;
let rectY = null;
let prevRectX = 0;
let prevRectY = 0;
let prevWidth = 0;
let prevHeight = 0;

function start(e) {
    isDrawing = true;
    // console.log(toolSet.getSelected());
    switch (toolSet.getSelected()) {
        case 'brush':
            cvctx.beginPath();
            break;
        case 'rectangle':
            rectX = e.clientX - canvas.offsetLeft;
            rectY = e.clientY - canvas.offsetTop;
            break;
        default:
            throw new Error("Unknown Tool")
            break;
    }
}

function draw(e) {
    if (!isDrawing) return
    switch (toolSet.getSelected()) {
        case 'brush':
            cvctx.lineTo(e.clientX - canvas.offsetLeft,
                e.clientY - canvas.offsetTop);
            cvctx.stroke();
            break;
        case 'rectangle': {
            let newX = e.clientX - canvas.offsetLeft;
            let newY = e.clientY - canvas.offsetTop;

            ocvclass.clearCanvas();

            ocvctx.strokeRect(rectX, rectY, newX - rectX, newY - rectY);

            prevRectX = rectX;
            prevRectY = rectY;
            prevWidth = newX - rectX;
            prevHeight = newY - rectY;
            break;
        }
        default:
            throw new Error();
            break
    }
}

const exporter = new Exporter(cvclass);

function stop(e) {
    if (!isDrawing) return
    switch (toolSet.getSelected()) {
        case 'brush':
            cvctx.stroke();
            cvctx.closePath();
        case 'rectangle':
            cvctx.strokeRect(prevRectX, prevRectY, prevWidth, prevHeight);
            ocvclass.clearCanvas();
            break;
        default:
            break;
    }

    isDrawing = false;
    
    exporter.add();
}

function clearCanvas() {
    if (isDrawing) return
    cvclass.clearCanvas();
    exporter.reset();
}

document.querySelector("#clearButton").addEventListener("click", clearCanvas);
document.querySelector("#undoButton").addEventListener("click", () => exporter.pop());
document.querySelector("#saveToJson").addEventListener("click", () => exporter.exportToImage());
