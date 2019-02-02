var noiseScale = 1;
var minLength = 50,
  maxLength = 300;
minWidth = 1;
maxWidth = 8;
var numBlossoms = 1;
var blossoms = new Array();
var backgroundColor;
var colors = [];
var speed = 100;
// var

function setup() {
  rectMode(CENTER);
  strokeWeight(5);
  createCanvas(800, 800);
  setupColors();
  background(backgroundColor);
  // translate(width/2,height/2);
  for (var i = 0; i < numBlossoms; i++) {
    spawnBlossom();
  }

}

function spawnBlossom() {
  let randomLength = random(minLength, maxLength);
  let randomWidth = random(minWidth, maxWidth);
  let randomColor = colors[floor(random(0, colors.length))];
  let colorVariation = random(-50, 50);
  randomColor = color(red(randomColor) + colorVariation, green(randomColor) + colorVariation, blue(randomColor) + colorVariation);
  var newBlossom = new Blossom(width / 2, height / 2, randomLength, randomWidth, randomColor);
  // console.log(newBlossom)
  blossoms.push(newBlossom);
  return newBlossom;
}


function setupColors() {
  backgroundColor = color(0, 5, 35);
  colors.push(color(255, 0, 174, 200));
  colors.push(color(204, 0, 255, 200));
  colors.push(color(89, 0, 255, 200));
  colors.push(color(255, 200));
}

function draw() {
  background(red(backgroundColor),green(backgroundColor),blue(backgroundColor),2.5);
  for (blossom of blossoms) {
    for (var i = 0; i < speed; i++) {
      blossom.grow();
      var nextPos = p5.Vector.add(blossom.pos, blossom.velocity);
      if(!inBounds(nextPos.x,nextPos.y, 0, width, 0, height))
        blossom.velocity.rotate(180);
    }

    if (blossom.doneGrowing() ||
        blossom.pos.x>=width||blossom.pos<=0||blossom.pos.y>=height||blossom.pos.y<=0) {
      var newBlossom = spawnBlossom();
      newBlossom.pos = blossom.pos;
      newBlossom.dir = blossom.dir;
      newBlossom.pos.x = constrain(newBlossom.pos.x,0,width);
      newBlossom.pos.y = constrain(newBlossom.pos.y,0,height);
      var index = blossoms.indexOf(blossom);
      blossoms.splice(index, 1);
    }
  }
}

function Blossom(x, y, blossomLength = 1,  blossomWidth = 1, color) {
  this.dir = p5.Vector.fromAngle(radians(random(0, 360)));
  this.pos = createVector(x, y);
  this.speed = blossomLength * random(0.001, 0.0005);
  this.velocity = this.dir.copy().mult(this.speed);
  this.easeAmount = random(2, 4);
  this.color = color;
  var blossomWidth = blossomWidth;
  var blossomLength = blossomLength;
  var currentLength = 0;
  var origin = createVector(x, y);
  var randomSeed = random(0, 2);

  this.grow = function() {
    if (currentLength <= blossomLength) {
      angleMode(DEGREES);
      //mode 1
      console.log(noise(this.pos.x, this.pos.y));
      var angle = map(noise(this.pos.x / noiseScale, this.pos.y / noiseScale), 0, 1, -1, 1) * TWO_PI / 360;
      this.dir.rotate(angle);
      this.pos.add(this.velocity);
      currentLength = constrain(currentLength, 0,blossomLength);
      currentLength += this.speed;
      this.velocity = this.dir.copy().mult(this.speed);

      //mode 2
      // this.pos.add(this.velocity);
      // var angle = noise(this.pos.x / noiseScale, this.pos.y / noiseScale) * TWO_PI * noiseScale;
      // this.dir.x = cos(angle);
      // this.dir.x = sin(angle);
      // this.velocity = this.dir.copy().mult(this.speed);
      // currentLength += this.speed;

      this.drawBlossom();
    }
  }

  this.doneGrowing = function() {
    return currentLength > blossomLength;
  }

  this.drawBlossom = function() {
    // console.log(currentWidth);
    var colorFallOff = -50;
    for (var i = 0; i < 1; i++) {
      var currentWidth = blossomWidth * ease(abs(abs(1 - currentLength / blossomLength * 2) - 1), 0.5+i * 2);

      var sectionWidth = currentWidth * (3 - i) / 3;
      var leftHalf = p5.Vector.add(this.pos, rotate2DVector(this.dir, -90).mult(sectionWidth));
      var rightHalf = p5.Vector.add(this.pos, rotate2DVector(this.dir, 90).mult(sectionWidth));

      var r = red(this.color) + colorFallOff * i;
      var g = green(this.color) + colorFallOff * i;
      var b = blue(this.color) + colorFallOff * i;

      stroke(r, g, b);
      fill(r,g,b);
      line(leftHalf.x, leftHalf.y, rightHalf.x, rightHalf.y);
      // line(this.pos.x, this.pos.y, leftHalf.x, leftHalf.y);
      // line(this.pos.x, this.pos.y, rightHalf.x, rightHalf.y);

      //Enable for drawing from origin point
      // line(origin.x, origin.y, leftHalf.x, leftHalf.y);
      // line(origin.x, origin.y, rightHalf.x, rightHalf.y);
    }

  }

}
