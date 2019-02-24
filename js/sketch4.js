// *** PROPERTIES ***
var canvas;
var canvasParent = "";
var startTime;
var flowers = [];
var colorThemes;
var targetFPS = 30;

// *** BRANCH PROPERTIES ***
// The degrees where the branches grow
var numFlowers = 40;
var spawnWidth = 1920;

// due to how the canvas setup this should be the opposite of the regular cartesian coordinate
var blossomCol;
var minBranchWidth = 60,
  maxBranchWidth = 120;
var startGrowthSpeed = 3;
var endGrowthSpeed = 0.8;
var globalRotationSpeed = 0.1;
var noiseScale = 0.01;

const refWindowWidth = 1920,
  refWindowHeight = 938;
const resizeFactor = 0.8;

function setup() {
  // spawnWidth = canvas.width;
  canvas = createCanvas(windowWidth, windowHeight);
  fitCanvasToWindow();
  canvas.style("z-index", "-1");
  canvas.style("overflow", "hidden");
  canvas.style("outline", "0");
  init();

  if (canvasParent !== undefined && canvasParent != "") {
    canvas.parent(canvasParent);
  }
  positionCanvas();

  setupColorThemes();
  setupFlowers();
  // assign a noise seed to get consistent results
  noiseSeed(random(0, 5));
  frameRate(targetFPS);
}

// called every frame
function draw() {
  growSeparate();
  strokeWeight(0);
  fill(0, 0, 0, 15);
  rect(0, 0, canvas.width, canvas.height);

  // DEBUG
  // debugMousePos(0, false);
  // spawnArea.draw();
}

// called when web window is resized
function windowResized() {
  fitCanvasToWindow();
  positionCanvas();
  setupFlowers();
}

// assign data that only can be created at runtime
function init() {
  blossomCol = color(24, 37, 228);

  spawnWidth = resizeToWindow(spawnWidth, resizeFactor);
  spawnArea = new Bound(
    canvas.width - spawnWidth / 2,
    canvas.height - 100,
    spawnWidth,
    200
  );

  minBranchWidth = resizeToWindow(minBranchWidth, resizeFactor);
  maxBranchWidth = resizeToWindow(maxBranchWidth, resizeFactor);
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
    // console.log(i + ": " + flower.getDistFromBound(canvas.width, canvas.height))
    // console.log("damp: " + dampen01 + ", dist: " + flower.getDistFromBound(canvas.width, canvas.height));
    flower.grow( startGrowthSpeed);
    flower.draw();
  }
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

function findFlowerClosestToBound() {
  let resultIndex = 0;
  for (let i = 1; i < flowers.length; i++) {
    if (
      flowers[i].getDistFromBound(canvas.width, canvas.height) <
      flowers[resultIndex].getDistFromBound(canvas.width, canvas.height)
    ) {
      resultIndex = i;
    }
  }
  // console.log("index: " + resultIndex + ", dist: " + flowers[resultIndex].getDistFromBound(canvas.width, canvas.height));
  return flowers[resultIndex];
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

function setupColorThemes() {
  colorThemes = new ColorTheme(
    color(25, 12, 255),
    color(242, 255, 245),
    color(255, 242, 252)
  );
}

function setupFlowers() {
  clear();
  
  for (let i = 0; i < numFlowers; i++) {
    let randomWidth = random(minBranchWidth, maxBranchWidth);

    // add variation
    colorMode(HSB);
    let randBlossomColor = color(
      hue(blossomCol) + random(-10, 20),
      saturation(blossomCol),
      brightness(blossomCol) + random(-80, -50)
    );
    colorMode(RGB, 255);

    let pos = createVector(random(0, canvas.width), random(0, canvas.height));
    flowers[i] = new Flower(
      color(255),
      randBlossomColor,
      randomWidth,
      undefined,
      undefined,
      0.2
    );
    flowers[i].dir = createVector(0, 1);
    flowers[i].pos = pos;
    flowers[i].rotationSpeed = globalRotationSpeed;
    flowers[i].speed = lerp(endGrowthSpeed, startGrowthSpeed, smoothstep(minBranchWidth,maxBranchWidth, randomWidth));


    // debug
    // flowers[i] = new Flower(
    //   color(random(40, 120)),
    //   randomWidth,
    //   15,
    //   undefined,
    //   0.2
    // );

    // flowers[i].dir = randomDir;
  }

  for (let i = numFlowers; i < numFlowers + 10; i++) {
    let pos = createVector(random(0, canvas.width), random(0, canvas.height));
    flowers[i] = new Flower(
      color(255),
      color(255),
      4,
      undefined,
      undefined,
      0.2
    );
    flowers[i].dir = createVector(0, 1);
    flowers[i].pos = pos;
    flowers[i].rotationSpeed = globalRotationSpeed/2;
    flowers[i].speed = 0.5;
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
  this.speed = 1;
}

Flower.prototype = {
  time: function() {
    return millis() / 1000 - this.startTime;
  },
  grow: function(speed) {
    this.lastPos = this.pos.copy();
    this.pos.add(p5.Vector.mult(this.dir, speed * this.speed));
    // maps the noise from 0~1 to -1~1
    let rotateDegree = noise(this.pos.x * noiseScale, this.pos.y * noiseScale);
    rotateDegree = map(rotateDegree, 0, 1, -1, 1);
    this.dir.rotate(rotateDegree * this.rotationSpeed);

    // blossom if lifetime runs out
    if (this.pos.x > canvas.width) {
      this.pos.x = 0;
      this.lastPos.x = 0;
    }
    if (this.pos.x < 0) {
      // this.dir.x = -this.dir.x;
      this.pos.x = canvas.width;
      this.lastPos.x = canvas.width;
    }
    if (this.pos.y > canvas.height) {
      this.pos.y = 0;
      this.lastPos.y = 0;
    }
    if (this.pos.y < 0) {
      // this.dir.x = -this.dir.x;
      this.pos.y = canvas.height;
      this.lastPos.y = canvas.height;
    }
  },
  draw: function() {
    let variableWidth = noise(this.pos.x * noiseScale * 0.5);
    stroke(this.blossomColor);
    strokeWeight(this.width * lerp(0, 1, variableWidth));
    line(this.lastPos.x, this.lastPos.y, this.pos.x, this.pos.y);
  },

  getDistFromBound: function(sizeX, sizeY) {
    var distX = this.getDistFromBoundX(sizeX);
    var distY = this.getDistFromBoundY(sizeY);
    // console.log("x: " + this.pos.x + ", y: " + this.pos.y);
    // check which coordinate the position is closer to
    return distX < distY ? distX : distY;
  },
  getDistFromBoundX: function(sizeX) {
    if (this.pos.x < sizeX / 2) {
      return this.pos.x;
    }
    return sizeX - this.pos.X;
  },
  getDistFromBoundY: function(sizeY) {
    if (this.pos.y < sizeY / 2) {
      return this.pos.y;
    }
    return sizeY - this.pos.y;
  }
};

function ColorTheme(colors) {
  this.colors = colors;
}
