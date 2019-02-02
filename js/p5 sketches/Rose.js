var lineLength = 200;
var speed = 1 / 30;
var backgroundColors = [];
var foregroundColor;
var foregroundColor2;
var dotColors = []
var iterationSpeed;
var isFirstFrameCompleted;
var vector1;
var vector2;
var leaves = [];
var noiseScale = 800;
var r = 2;

function setup() {
    backgroundColors[0] = color(25, 12, 255);
    backgroundColors[1] = color(242, 255, 245);
    backgroundColors[2] = color(255, 242, 252);
    backgroundColors[3] = color(28, 12, 24);
    foregroundColor = color(255, 0, 72);
    foregroundColor2 = color(45, 13, 66);
    dotColors[0] = color(88, 255, 0);
    dotColors[1] = color(15, 48, 0);
    dotColors[2] = color(255, 243, 155);
    dotColors[3] = color(15, 255, 155);
    dotColors[4] = color(0, 33, 117);
    createCanvas(800, 800);
    console.log(floor(random(0, backgroundColors.length)));
    background(backgroundColors[floor(random(0, backgroundColors.length))]);
    vector1 = createVector(0, 0);
    vector2 = createVector(0, 0);
    //background();

    for (let i = 0; i < 64; i++) {
        let randomPos = createVector(cos(random(0, 2 * PI)), sin(random(0, 2 * PI)));
        randomPos.mult(lineLength + 1);
        leaves[i] = new Leaf(randomPos.x, randomPos.y, random(r * 0.5, r));
    }
}

function draw() {
    //since p5 does not support color, alpha parameter input, 
    //I'm simply pasting in here the background color values
    //and tuning the alpha down
    //background(fadeBackgroundColor);
    //rotate(cos(frameCount/60));
    translate(width / 2, height / 2);
    rotate(frameCount * 1 / 720);

    //debug();

    drawCenter();
    drawSurroundings();
    if (!isFirstFrameCompleted)
        isFirstFrameCompleted = true;
}

function debug() {
    ellipse(0, 0, 2 * lineLength, 2 * lineLength);
}

//currently this is spaghetti code. I might rewrite a cleaner version later... :P
function drawCenter() {
    let rotationSpeed = frameCount * speed;

    iterationSpeed = 1 / 30;
    let sinLineLength = map(sin(frameCount * iterationSpeed), -1, 1, 0, 1) * noise(frameCount * iterationSpeed) * 1.5 * lineLength;
    sinLineLength = min(sinLineLength, lineLength);
    var color = lerpColor(foregroundColor2, foregroundColor, map(sin(PI * rotationSpeed), -1, 1, 0, 1));
    stroke(color);
    strokeWeight(noise(frameCount * iterationSpeed) * 3);

    let prevVector1 = createVector(vector1.x, vector1.y);
    let prevVector2 = createVector(vector2.x, vector2.y);

    vector1.x = -sin(2 * rotationSpeed) * sinLineLength;
    vector1.y = -cos(2 * rotationSpeed) * sinLineLength;
    vector2.x = sin(rotationSpeed) * sinLineLength;
    vector2.y = cos(rotationSpeed) * sinLineLength;
    if (isFirstFrameCompleted) {
        line(vector1.x, vector1.y, prevVector1.x, prevVector1.y);
        line(vector2.x, vector2.y, prevVector2.x, prevVector2.y);
    }


    //line(-sin(2 * rotationSpeed)* sinLineLength, -cos( 2* rotationSpeed)* sinLineLength, base.x, base.y);
    line(vector1.x, vector1.y, vector2.x, vector2.y);


}

function drawSurroundings() {
    //version 1
	/*
	let randomStrokeWeight = random(4,24);
	let randomPos = createVector(random(-400,400),random(-400,400));
	let randomDotColor = lerpColor(dotColor,dotColor2, floor(random(0,2)));
	stroke(randomDotColor);
	strokeWeight(randomStrokeWeight);

	let distFromCenter = sqrt(sq(randomPos.x)+sq(randomPos.y));
	if(distFromCenter > lineLength + randomStrokeWeight)
	{
			point(randomPos.x, randomPos.y);

	}
	*/

    //version 2
    for (let i = 0; i < leaves.length; i++) {

        leaves[i].move();
        leaves[i].checkEdge();
        leaves[i].draw();
    }
}

function Leaf(x, y, r) {
    this.pos = createVector(x, y);
    this.radius = r;
    this.vel = createVector(0, 0);
    this.speed = 0.5;
    this.dir = createVector(0, 0);
    let randomDotColor = dotColors[floor(random(0, dotColors.length))];
    this.color = randomDotColor;

    this.move = function () {
        var angle = noise(this.pos.x / noiseScale, this.pos.y / noiseScale) * TWO_PI * noiseScale;
        this.dir.x = cos(angle);
        this.dir.y = sin(angle);
        this.vel = this.dir.copy();
        this.vel.mult(this.speed);
        this.pos.add(this.vel);
    }

    this.draw = function () {
        //let nextPos = createVector(this.pos.x, this.pos.y);
        //line(this.pos.x, this.pos.y, nextPos.x, nextPos.y);
        //this.pos = nextPos;
        if (!(this.pos.x > width / 2 || this.pos.x < -width / 2 || this.pos.y > height / 2 || this.pos.y < -height / 2 ||
            sqrt(sq(this.pos.x) + sq(this.pos.y)) <= lineLength)) {
            stroke(this.color);
            strokeWeight(0);
            fill(this.color);
            ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
        }
    }

    this.checkEdge = function () {
        if (this.pos.x > width / 2 || this.pos.x < -width / 2 || this.pos.y > height / 2 || this.pos.y < -height / 2 ||
            sqrt(sq(this.pos.x) + sq(this.pos.y)) <= lineLength) {
            let randomPos = createVector(cos(random(0, 2 * PI)), sin(random(0, 2 * PI)));
            randomPos.mult(lineLength + 1);
            this.pos.x = randomPos.x;
            this.pos.y = randomPos.y;
        }
    }
}