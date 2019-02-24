// *** PROPERTIES ***
var canvas;
var canvasParent = "";
var startTime;
var flowers = [];
var colorThemes;
var targetFPS = 60;

// prevent branches from growing outside of the canvas
var canvasPadding = 300;
var canvasMargin = 100;

// referenced size for resizing elements
const refWindowWidth = 1920,
  refWindowHeight = 938;
const resizeFactor = 0.8;

// canvas
var spawnArea;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  fitCanvasToWindow();
  canvas.style("z-index", "-1");
  canvas.style("display", "block");
  canvas.style("overflow", "hidden");
  canvas.style("outline", "0");

  if (canvasParent !== undefined && canvasParent != "") {
    canvas.parent(canvasParent);
  }
  positionCanvas();

  noiseSeed(random(0, 5));
  frameRate(targetFPS);
}

var pos = 0;
var speed = 20;
var rotateSpeed = 2;
// called every frame
function draw() {
    strokeWeight(1);
    fill(100);
    stroke(255);
    pos = pos + speed;
    if(pos>canvas.width)
    {
        pos = 0;
    }
    // ellipse(pos, canvas.height/2, sin(millis()/1000 * rotateSpeed) * 100);
    line(pos, canvas.height, pos + sin(millis()/1000 * rotateSpeed) * 100, 
    canvas.height/2 + cos(millis()/1000 * rotateSpeed) *  100);
    fill(0,0,0,10);
    rect(0,0,canvas.width,canvas.height);
}

// called when web window is resized
function windowResized() {
  fitCanvasToWindow();
  positionCanvas();
}

// returns a value that's resized based on current window size
// Useful for rescaling stroke sizes when window resizes
// param fromSize:
// param factor: a number in range 0-1 to indicate the resize factor
function resizeToWindow(fromSize, factor) {
  return fromSize * lerp(1, windowWidth / refWindowWidth, factor);
}

// fit canvas width/height with the entire window with
function fitCanvasToWindow(percentX, percentY) {
  // a small number (1) is added to temporarily resolve scroll bar issue
  resizeCanvas(
    percentX === undefined ? windowWidth - 0.5 : windowWidth * percentX - 0.5,
    percentY === undefined ? windowHeight - 0.5 : windowHeight * percentY - 0.5
  );
}

function growSeparate(stopAtMargin) {
  for (let i = 0; i < flowers.length; i++) {
    let flower = flowers[i];

    let dampenSpeed01 = 1;
    if (!spawnArea.contains(flower.pos)) {
      dampenSpeed01 = smoothstep(
        canvasMargin,
        canvasPadding,
        flower.getDistFromBound(canvas.width, canvas.height)
      );
    }
    // console.log(i + ": " + flower.getDistFromBound(canvas.width, canvas.height))
    // console.log("damp: " + dampen01 + ", dist: " + flower.getDistFromBound(canvas.width, canvas.height));
    flower.grow(lerp(endGrowthSpeed, startGrowthSpeed, dampenSpeed01));
    flower.draw();

    // if flower has hit the margin area, make it blossom
    if (stopAtMargin !== undefined && stopAtMargin) {
      if (dampenSpeed01 == 0 && !spawnArea.contains(flower.pos)) {
        flower.blossom();
      }
    }
  }
}

function growUntilMarginUnion() {
  let marginHit = false;
  let flowerClosestToBound = getDistFromBound();
  let dampen01 = smoothstep(
    canvasMargin01,
    canvasPadding01,
    flowerClosestToBound.getDistFromBound(canvas.width, canvas.height)
  );
  if (dampen01 == 0 && !spawnArea.contains(flowerClosestToBound.pos)) {
    if (!spawnArea.contains(flowerClosestToBound.pos)) {
      console.log(
        "NOT contain: " +
          flowerClosestToBound.pos.x +
          ", " +
          flowerClosestToBound.pos.y
      );
    }
    marginHit = true;
  }
  for (let i = 0; i < flowers.length; i++) {
    let flower = flowers[i];

    flower.grow(lerp(dampen01, startGrowthSpeed, endGrowthSpeed));
    flower.draw();
    if (marginHit) {
      flower.blossom();
    }
  }
  // if (frameCount % 150 == 0) {
  //   noiseSeed(random(0, 100));
  //   console.log("change noise");
  // }
}

function debugMousePos(size, logPosition) {
  if (size != 0) {
    ellipse(mouseX, mouseY, size, size);
  }
  if (logPosition) {
    console.log(
      "x: " +
        mouseX +
        "/" +
        canvas.width +
        ", y: " +
        mouseY +
        "/" +
        canvas.height
    );
  }
}

// Credit: https://github.com/gre/smoothstep
// For values of x between min and max, returns a smoothly varying value that ranges from 0 at x = min to 1 at x = max.
function smoothstep(min, max, value) {
  var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

function positionCanvas(startAtEnd = false) {
  var x = windowWidth - canvas.width;
  var y = windowHeight - canvas.height;
  if (startAtEnd) {
    canvas.position(x, y);
  } else {
    canvas.position(0, 0);
  }
}

// for future usage:
// https://stackoverflow.com/questions/2752725/finding-whether-a-point-lies-inside-a-rectangle-or-not
// Used with P5's vector

function Bound(offsetX, offsetY, sizeX, sizeY) {
  this.offset = createVector(offsetX, offsetY);
  this.size = createVector(sizeX, sizeY);
  this.offsetX = offsetX;
  this.offsetY = offsetY;
  this.sizeX = sizeX;
  this.sizeY = sizeY;
}

Bound.prototype = {
  randomPoint: function() {
    return createVector(
      random(offsetX - sizeX / 2, offsetX + this.size / 2),
      random(offsetY - sizeY / 2, offsetY + sizeY / 2)
    );
  },
  contains: function(point) {
    // a very naive and non-flexible solution
    return (
      point.x <= this.offset.x + this.size.x / 2 &&
      point.x >= this.offset.x - this.size.x / 2 &&
      point.y <= this.offset.y + this.size.y / 2 &&
      point.y >= this.offset.y - this.size.y / 2
    );
  },
  draw: function() {
    if (col === undefined) {
      col = color(255, 255, 255);
    }

    stroke(col.toString("#rrggbb"));
    strokeWeight(2);
    noFill();
    rect(
      this.offset.x - this.size.x / 2,
      this.offset.y - this.size.y / 2,
      this.size.x,
      this.size.y
    );
    ellipse(this.offset.x, this.offset.y, 1, 1);
  }
};

// Experimental
function Polygon2D(points) {
  this.points = points;
}

Polygon2D.prototype = {
  addPoint: function(point) {
    this.points.push(point);
  }
};

function Flower(
  stemColor,
  blossomColor,
  width,
  blossomSize,
  lifetime,
  blossomTime
) {
  this.stemColor = stemColor;
  this.blossomColor = blossomColor !== undefined ? blossomColor : stemColor;
  this.width = width;
  this.blossomSize = blossomSize !== undefined ? blossomSize : width;
  this.lifetime = lifetime;
  this.blossomTime = blossomTime;
  this.isGrowing = true;
  this.hasBlossom = false;
  this.pos;
  this.dir;
  this.numBlossoms = 2;
  this.ringIntervalSec = 0.1;
  this.startTime = millis() / 1000;
  this.blossomStartTime;
  this.currLifetime;
  this.rotationSpeed;
}
