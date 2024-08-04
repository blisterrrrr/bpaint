const sizeSlider = document.querySelector("#brushSizeSlider");
const sizeLabel = document.querySelector("#brushSizeLabel");
sizeLabel.innerText = `Brush Size (${sizeSlider.value})`;
let isDrawing = false;
let color = "black";
let brushSize = sizeSlider.value;
sizeSlider.addEventListener("change", (e) => {
    brushSize = e.currentTarget.value;
    sizeLabel.innerText = `Brush Size (${e.currentTarget.value})`
});

const canvas = document.querySelector('#canvas');
const cvctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 500;

canvas.addEventListener('mousedown', start);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stop);
canvas.addEventListener('mouseout', stop);

function start(e) {
    // e.preventDefault();
    isDrawing = true;
    cvctx.beginPath();
}

function draw(e) {
    // e.preventDefault()
    if (!isDrawing) return
    cvctx.lineTo(e.clientX - canvas.offsetLeft,
        e.clientY - canvas.offsetTop);
    cvctx.lineWidth = brushSize;
    cvctx.strokeStyle = color;
    cvctx.lineCap = "round";
    cvctx.lineJoin = "round";
    cvctx.stroke();
}

function stop(e) {
    // e.preventDefault();
    if (!isDrawing) return
    cvctx.stroke();
    cvctx.closePath();
    isDrawing = false;
}

function clearCanvas() {
    if (isDrawing) return
    cvctx.clearRect(0, 0, canvas.width, canvas.height);
}