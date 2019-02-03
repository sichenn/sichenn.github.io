// *** PROPERTIES ***
var canvas;
var canvasParent;

// canvas
var spawnArea;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  fitCanvasToWindow();
  canvas.style('z-index', '0');
  canvas.style('display', 'block');
  canvas.style('overflow', 'hidden');
  canvas.style('outline','0');

  if (canvasParent !== undefined && canvasParent != "") {
    canvas.parent(canvasParent);
}
}

// called every frame
function draw() {
  background(100,0,0);
}

// called when web window is resized
function windowResized() {
    fitCanvasToWindow();
}

// fit canvas width/height with the entire window with
function fitCanvasToWindow() 
{
    // a small number (0.5) is added to temporarily resolve scroll bar issue
    resizeCanvas(windowWidth - 0.5, windowHeight - 0.5);
    // resizeCanvas(windowWidth - 0.5, windowHeight - 0.5);
    canvas.position(0,0);
}