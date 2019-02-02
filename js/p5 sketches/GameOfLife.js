// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/Pn1g1wjxl_0

let resolution = 20;
let startColor;
let endColor;
let updateInterval = 1;
let currentFrame = 0;
let isPlaying;

var input, button;

var cellGrid;
// test.EvaluateNeighbors(2, 2);

function setup() {
  startColor = color(255, 255, 255);
  endColor = color(255, 255, 255);
  var drawCanvas = createCanvas(700, 700);
  console.log(drawCanvas);
  drawCanvas.parent("p5Canvas");

  let worldSize = 600;
  let cols = worldSize / resolution;
  let rows = worldSize / resolution;
  cellGrid = new CellGrid(cols, rows);
  // console.log("cols: " + cellGrid.columns + ", rows: " + this.grid.rows);
  cellGrid.initialize();

  isPlaying = false;

  // createElement('bol', 'refresh every');
  // input = createInput();
  // createElement('bold', 'frames');
}

function draw() {
  clear();
  background(0);

  // if (input.value() != "")
  //   updateInterval = parseInt(input.value());

  for (let i = 0; i < cellGrid.columns; i++) {
    for (let j = 0; j < cellGrid.rows; j++) {
      let x = i * resolution;
      let y = j * resolution;
      if (cellGrid.grid[i][j] !== undefined && cellGrid.grid[i][j] != null) {
        fill(cellGrid.grid[i][j].cellColor);
        // stroke(10);
        noStroke();
        rect(x, y, resolution, resolution);
      }
    }
  }

  if (isPlaying) {
    currentFrame++;

    if (currentFrame % updateInterval == 0) {
      cellGrid.updateGrid();
      // cellGrid.reportGrid();
    }
  }
}

function mouseClicked() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    // console.log("x: " + mouseX + ", y: " + mouseY);
    console.log(
      "col: " +
        floor(mouseX / resolution) +
        ", row:" +
        floor(mouseY / resolution)
    );
    let col = floor(mouseX / resolution);
    let row = floor(mouseY / resolution);
    if (col < cellGrid.grid.length && row < cellGrid.grid[col].length) {
      if (cellGrid.grid[col][row] == null) cellGrid.grid[col][row] = new Cell();
      else cellGrid.grid[col][row] = null;
    }
  }
  // prevent default
  // return false;
}

function mouseDragged() {
  fill(255);
  ellipse(mouseX, mouseY, 10, 10);
  // prevent default
  // return false;
}

function togglePlay() {
  isPlaying = !isPlaying;
}
