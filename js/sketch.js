// *** PAGE PROPERTIES ***
var canvas;
var canvasParent = "";
var startTime;
var flowers = [];
var colorThemes;
var targetFPS = 30;

// *** BRANCH PROPERTIES ***
// The degrees where the branches grow
var numFlowers = 30;
var spawnWidth = 700;
// canvas 
var spawnArea;
var minDeg = -90,
  maxDeg = -120;
// due to how the canvas setup this should be the opposite of the regular cartesian coordinate
var blossomColor;
var minLifetime = 2,
  maxLifetime = 7;
var minBranchWidth = 3,
  maxBranchWidth = 6.5;
var startGrowthSpeed = 4.5;
var endGrowthSpeed = 1.5;
var globalRotationSpeed = 0.06;
var noiseScale = 0.005;
// prevent branches from growing outside of the canvas
var canvasPadding = 300;
var canvasMargin = 100;

// const standardWindowSize = 1080;

function setup() {
  fitCanvasToWindow(1, 1);
  // spawnWidth = canvasWidth;
  canvas = createCanvas(canvasWidth, canvasHeight);
  init();

  canvas.style("z-index", "0");
  if (canvasParent !== undefined && canvasParent != "") {
    canvas.parent(canvasParent);
  }
  positionCanvas();

  setupColorThemes();
  setupFlowers();
  // assign a noise seed to get consistent results
  noiseSeed(0);
  frameRate(targetFPS);
}

// assign data that only can be created at runtime
function init()
{
  blossomColor = color(180, 180, 180);
  spawnArea = new Bound(canvasWidth - spawnWidth / 2, canvasHeight - 100, spawnWidth, 200);
}

function fitCanvasToWindow(percentX, percentY) {
  canvasWidth = window.innerWidth * percentX;
  canvasHeight = window.innerHeight * percentY;
}

// called every frame
function draw() {
  // growUntilMarginUnion();
  growUntilMarginSeparate();

  // DEBUG
  // debugMousePos(0, false);
  // spawnArea.draw();
}

function growUntilMarginSeparate() {
  for (let i = 0; i < flowers.length; i++) {
    let flower = flowers[i];

    var dampenSpeed01 = 1;
    if (!spawnArea.contains(flower.pos)) {
      dampenSpeed01 = smoothstep(
        canvasMargin,
        canvasPadding,
        flower.getDistFromBound(canvasWidth, canvasHeight)
      );
    }
    // console.log("damp: " + dampen01 + ", dist: " + flower.getDistFromBound(canvasWidth, canvasHeight));
    flower.grow(lerp(endGrowthSpeed, startGrowthSpeed, dampenSpeed01));
    flower.draw();
    // if flower has hit the margin area, make it blossom
    if (dampenSpeed01 == 0 && !spawnArea.contains(flower.pos)) {
      flower.blossom();
    }
  }
  // if (frameCount % 150 == 0) {
  //   noiseSeed(random(0, 100));
  //   console.log("change noise");
  // }
}

function growUntilMarginUnion() {
  let marginHit = false;
  let flowerClosestToBound = getDistFromBound();
  let dampen01 = smoothstep(
    canvasMargin01,
    canvasPadding01,
    flowerClosestToBound.getDistFromBound(canvasWidth, canvasHeight)
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
      "x: " + mouseX + "/" + canvasWidth + ", y: " + mouseY + "/" + canvasHeight
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
      flowers[i].getDistFromBound(canvasWidth, canvasHeight) <
      flowers[resultIndex].getDistFromBound(canvasWidth, canvasHeight)
    ) {
      resultIndex = i;
    }
  }
  // console.log("index: " + resultIndex + ", dist: " + flowers[resultIndex].getDistFromBound(canvasWidth, canvasHeight));
  return flowers[resultIndex];
}

// called when mouse is clicked
function mouseClicked() {
  // flowers.forEach(element => {
  //   // element.isGrowing = !element.isGrowing;
  //   element.blossom(false);
  // });
}

// called when web window is resized
function windowResized() {
  positionCanvas();
}

function positionCanvas() {
  var x = windowWidth - canvasWidth;
  var y = windowHeight - canvasHeight;
  canvas.position(x, y);
}

function setupColorThemes() {
  colorThemes = new ColorTheme(
    color(25, 12, 255),
    color(242, 255, 245),
    color(255, 242, 252)
  );
}

function setupFlowers() {
  for (let i = 0; i < numFlowers; i++) {
    let randomDeg = random(minDeg, maxDeg);
    let randomDir = createVector(
      cos(radians(randomDeg)),
      sin(radians(randomDeg))
    );
    let randomWidth = random(minBranchWidth, maxBranchWidth);

    flowers[i] = new Flower(
      color(random(20, 80)),
      blossomColor,
      randomWidth,
      undefined,
      random(minLifetime, maxLifetime),
      0.2
    );

    // debug
    // flowers[i] = new Flower(
    //   color(random(40, 120)),
    //   randomWidth,
    //   15,
    //   undefined,
    //   0.2
    // );

    flowers[i].pos = createVector(canvasWidth + random(-spawnWidth, 0), canvasHeight);
    flowers[i].dir = randomDir;
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
  randomPoint: function () {
    return createVector(random(offsetX - sizeX / 2, offsetX + this.size / 2),
      random(offsetY - sizeY / 2, offsetY + sizeY / 2));
  },
  contains: function (point) {
    // a very naive and non-flexible solution
    return (
      point.x <= this.offset.x + this.size.x / 2 &&
      point.x >= this.offset.x - this.size.x / 2 &&
      point.y <= this.offset.y + this.size.y / 2 &&
      point.y >= this.offset.y - this.size.y / 2
    );
  },
  draw: function () {
    if (col === undefined) {
      col = color(255, 255, 255);
    }

    stroke(col.toString("#rrggbb"));
    strokeWeight(2);
    noFill();
    rect(this.offset.x - this.size.x / 2, this.offset.y - this.size.y / 2, this.size.x, this.size.y);
    ellipse(this.offset.x, this.offset.y, 1, 1);
  }
}

// Experimental
function Polygon2D(points) {
  this.points = points;
}

Polygon2D.prototype = {
  addPoint: function (point) {
    this.points.push(point);

  }
}

function Flower(stemColor, blossomColor, width, blossomSize, lifetime, blossomTime) {
  this.stemColor = stemColor;
  this.blossomColor = blossomColor !== undefined ? blossomColor : stemColor;
  this.width = width;
  this.blossomSize = blossomSize !== undefined ? blossomSize : width * 2;
  this.lifetime = lifetime;
  this.blossomTime = blossomTime;
  this.isGrowing = true;
  this.hasBlossom = false;
  this.pos;
  this.dir;
  this.numRings = 3;
  this.ringIntervalSec = 0.1;
  this.startTime = millis() / 1000;
  this.blossomStartTime;
}

Flower.prototype = {
  time: function () {
    return millis() / 1000 - this.startTime;
  },
  grow: function (speed) {
    if (this.isGrowing) {
      this.lastPos = this.pos.copy();
      this.pos.add(p5.Vector.mult(this.dir, speed));
      // maps the noise from 0~1 to -1~1
      this.dir.rotate(
        (noise((this.pos.x, this.pos.y ) * noiseScale) - 0.5)*2 *
        globalRotationSpeed
      );

      // blossom if lifetime runs out
      if (this.lifetime !== undefined && this.time() > this.lifetime) {
        this.blossom();
      }
    }
  },
  draw: function () {
    // draw stem
    if (this.isGrowing) {
      stroke(this.stemColor);
      strokeWeight(this.width);

      line(this.lastPos.x, this.lastPos.y, this.pos.x, this.pos.y);
    }

    // draw blossom
    if (this.blossomTime !== undefined) {
      
      if (millis() / 1000 - this.blossomStartTime <= this.blossomTime) {
        let currentSize = lerp(
          0,
          this.blossomSize,
          (millis() / 1000 - this.blossomStartTime) / this.blossomTime
        );
        if (currentSize < this.blossomSize) {
          stroke(this.blossomColor);
          fill(this.blossomColor);
          strokeWeight(this.width);
          ellipse(this.pos.x, this.pos.y, currentSize, currentSize);
          for (let i = 1; i <= this.numRings; i++) {
            noFill();
            if (
              millis() / 1000 - this.blossomStartTime >=
              (i * this.blossomTime) / this.numRings
            ) {
              // 5 is a magic number I found that makes the rings equal distant
              ellipse(this.pos.x, this.pos.y, this.blossomSize + i * this.width * 5);
            }
          }
        }
      }
    }
  },
  blossom: function (keepGrowing = false) {
    if (!this.hasBlossom) {
      this.blossomStartTime = millis() / 1000;
      stroke(255);
      fill(255);
      // ellipse(this.pos.x, this.pos.y, 20, 20);
      // ellipse(this.pos.x, this.pos.y, 20, 20);
      if (!keepGrowing) {
        this.isGrowing = false;
      }
      this.hasBlossom = true;
    }
  },
  getDistFromBound: function (sizeX, sizeY) {
    var distX = this.getDistFromBoundX(sizeX);
    var distY = this.getDistFromBoundY(sizeY);
    // console.log("x: " + this.pos.x + ", y: " + this.pos.y);
    // check which coordinate the position is closer to
    return distX < distY ? distX : distY;
  },
  getDistFromBoundX: function (sizeX) {
    if (this.pos.x < sizeX / 2) {
      return this.pos.x;
    }
    return sizeX - this.pos.X;
  },
  getDistFromBoundY: function (sizeY) {
    if (this.pos.y < sizeY / 2) {
      return this.pos.y;
    }
    return sizeY - this.pos.y;
  }
}

function ColorTheme(colors) {
  this.colors = colors;
}
