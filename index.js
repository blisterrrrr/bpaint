import { CanvasHolder } from "./CanvasHolder.js"
import { Exporter } from "./Exporter.js";
import { TOOLS, Toolset } from "./Toolset.js";
import { DropdownManager } from "./DropdownManager.js";
import { Utils } from "./utils.js"

const cvclass = new CanvasHolder("#canvas", 1000, 500);
const canvas = cvclass.getCanvas();
const cvctx = cvclass.setupCanvas("black", 10, "round", "round");
const ocvclass = new CanvasHolder("#overlayCanvas", 1000, 500);
const ocanvas = ocvclass.getCanvas();
const ocvctx = ocvclass.setupCanvas("black", 10, "round", "round");
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
const dropdowns = new DropdownManager("#toolSelectDrop")
  .setup((tool) => toolSet.selectTool(tool))
  .init();

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
let prevRaduis = 0;

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
    case 'circle':
      rectX = e.clientX - canvas.offsetLeft;
      rectY = e.clientY - canvas.offsetTop;

      ocvctx.beginPath();
      cvctx.beginPath();
      break;
    case 'line': {
      rectX = e.clientX - canvas.offsetLeft;
      rectY = e.clientY - canvas.offsetTop;

      ocvctx.beginPath();
      cvctx.beginPath();
      ocvctx.moveTo(rectX, rectY);
      cvctx.moveTo(rectX, rectY);
      break;
    }
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
    case 'circle': {
      let newX = e.clientX - canvas.offsetLeft;
      let newY = e.clientY - canvas.offsetTop;
      let radius = Utils.getDistance(rectX, rectY, newX, newY);

      ocvctx.closePath();
      ocvclass.clearCanvas();
      ocvctx.beginPath();
      ocvctx.arc(rectX, rectY, radius, 0, 2 * Math.PI);
      ocvctx.stroke();

      prevRectX = rectX;
      prevRectY = rectY;
      prevRaduis = radius;
      break;
    }
    case 'line': {
      let newX = e.clientX - canvas.offsetLeft;
      let newY = e.clientY - canvas.offsetTop;

      ocvctx.closePath();
      ocvclass.clearCanvas();
      ocvctx.beginPath();
      ocvctx.moveTo(rectX, rectY);
      ocvctx.lineTo(newX, newY);
      ocvctx.stroke();

      prevRectX = newX;
      prevRectY = newY;
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
    case 'circle':
      cvctx.arc(prevRectX, prevRectY, prevRaduis, 0, 2 * Math.PI);
      cvctx.stroke();
      cvctx.closePath();
      ocvclass.clearCanvas();
      break;
    case 'line':
      cvctx.lineTo(prevRectX, prevRectY);
      cvctx.stroke();
      cvctx.closePath();
      ocvclass.clearCanvas();
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
