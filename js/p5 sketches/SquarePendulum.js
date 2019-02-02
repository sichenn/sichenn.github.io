var numLines = 5;
var lineLength = 50;
var speed = 1 / 60;
function setup() {
	createCanvas(800, 800);
	background(255,240,221);

}

function draw() {
		let rotationSpeed = frameCount * speed;
		let degree = degrees(2* rotationSpeed) + 180;
		// background(255,240,221,1);
		strokeWeight(1);

		stroke(255,28,126,sin(PI * rotationSpeed) * 100);
		// stroke(255,28,126,100);
		translate(width/2, height/2);
		// var prevBase = createVector(0,0);
		var base = createVector(sin(rotationSpeed) * (numLines+1) * lineLength, cos(rotationSpeed)* (numLines+1) * lineLength);
		// var inverse =
		for(var i = 0; i < numLines; i++) {
			// rotate(sin(rotationSpeed * PI));
			line(- sin( 2* rotationSpeed)* (numLines+1) * lineLength, 0, base.x, base.y);

			// line(base.x, base.y, base.x + cos(rotationSpeed) * (numLines+1) * lineLength, base.y + sin(rotationSpeed)* (numLines+1) * lineLength);
			// var incrementX = (i%2 == 0)? sin(rotationSpeed) * (numLines+1) * lineLength:cos(rotationSpeed) * (numLines+1) * lineLength;
			// var incrementY = (i%2 == 0)? cos(rotationSpeed) * (numLines+1) * lineLength:sin(rotationSpeed) * (numLines+1) * lineLength;
			// base.x += incrementX;
			// base.y += incrementY;
			// ellipse(- sin( 2* rotationSpeed)* (numLines+1) * lineLength, 0,10,10);
			// ellipse(sin(rotationSpeed) * (numLines+1) * lineLength, cos(rotationSpeed)* (numLines+1) * lineLength,10,10);

			// line(50 - sin(2*rotationSpeed)* (numLines+1) * lineLength, -50, 50 + sin(rotationSpeed)* (numLines+1) * lineLength, -50 + cos(rotationSpeed)* (numLines+1) * lineLength);
			// ellipse(50 + sin(rotationSpeed)* (numLines+1) * lineLength, -50 + cos(rotationSpeed)* (numLines+1) * lineLength,10,10);

			// line(-50- sin(2*rotationSpeed)* (numLines+1) * lineLength, -50, -50 + sin(rotationSpeed)* (numLines+1) * lineLength, -50 + cos(rotationSpeed)* (numLines+1) * lineLength);
			// ellipse(-50 + sin(rotationSpeed)* (numLines+1) * lineLength, -50 + cos(rotationSpeed)* (numLines+1) * lineLength,10,10);

			// line(-50- sin(2*rotationSpeed)* (numLines+1) * lineLength, 50, -50 + sin(rotationSpeed)* (numLines+1) * lineLength, 50 + cos(rotationSpeed)* (numLines+1) * lineLength);
			// ellipse(-50 + sin(rotationSpeed)* (numLines+1) * lineLength, 50 + cos(rotationSpeed)* (numLines+1) * lineLength,10,10);

		}
}

function mouseClicked() {
	let rotationSpeed = frameCount * speed

	console.log(rotationSpeed);
}
