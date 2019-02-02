let width = 800;
let height = 800;

//Configuration
let noiseScale = 800;
let octave = 3,
    persistence = 1,
    lacunarity = 1;

//UI
var scaleInput, octaveInput, persistenceInput, lacunarityInput,
    scaleText, octaveText, persistenceText, lacunarityText,
    button, greeting, saveButton;

//Other
//When generation is over, data is stored in noiseMap
var noiseMap;
var drawSpeed = 3200;
var noiseGen;
var drawComplete = false;
var img;

function setup() {
    //increased width to include UI
    img = createImage(width, height); // same as new p5.Image(100, 100);
    img.loadPixels();
    createCanvas(width + 300, height);
    background(255);
    setupUI();
    refreshMap();

}


function setupUI() {
    scaleText = createElement("bold", "Scale");
    scaleText.position(width, 60);
    scaleInput = createInput(noiseScale);
    scaleInput.position(scaleText.x + 100, scaleText.y);
    octaveText = createElement("bold", "Octave");
    octaveText.position(width, 90);
    octaveInput = createInput(octave);
    octaveInput.position(octaveText.x + 100, octaveText.y);
    persistenceText = createElement("bold", "Persistence");
    persistenceText.position(width, 120);
    persistenceInput = createInput(persistence);
    persistenceInput.position(persistenceText.x + 100, persistenceText.y);
    lacunarityText = createElement("bold", "Lacunarity");
    lacunarityText.position(width, 150);
    lacunarityInput = createInput(lacunarity);
    lacunarityInput.position(lacunarityText.x + 100, lacunarityText.y);


    button = createButton('Generate');
    button.position(width, 180);
    button.mousePressed(refreshMap);

    saveButton = createButton('Save');
    saveButton.position(width, 220);
    saveButton.mousePressed(saveMap)
    // button.mousePressed(greet);
    greeting = createElement('bold', 'Configuration');
    greeting.position(width, 5);
}

function draw() {
    if (!drawComplete) {
        drawMap();
        saveButton.hide()
    } else {
        saveButton.show()
    }
}


function drawMap() {
    for (var i = 0; i < drawSpeed; i++) {
        var nextColor = noiseGen.next();
        if (!nextColor.done) {
            drawComplete = false;
            //stroke(nextColor.value.color);
            //point(nextColor.value.x, nextColor.value.y);
            img.set(nextColor.value.x, nextColor.value.y, nextColor.value.color);
        } else if (!drawComplete) {
            console.log("complete");
            drawComplete = true;

        }
    }
    img.updatePixels()
    image(img, 0, 0);
}

function saveMap() {
    img.save('perlin_noise', 'png');
}

function refreshMap() {
    drawComplete = true;
    let startTime = new Date().getTime();
    console.log(noiseGen);
    noiseScale = parseFloat(scaleInput.value());
    octave = parseFloat(octaveInput.value());
    persistence = parseFloat(persistenceInput.value());
    lacunarity = parseFloat(lacunarityInput.value());
    noiseGen = generateNoiseMap(width, height, noiseScale, octave, persistence, lacunarity, noiseMap);

    drawComplete = false;
    let endTime = new Date().getTime();
    let totalTime = endTime - startTime;
    console.log("refreshMap took: " + totalTime / 1000 + " seconds");
    //img.save('photo', 'png');

}

function* generateNoiseMap(width, height, scale, octaves, persistence, lacunarity, sendMapTo = null) {
    var map = make2DArray(width, height);
    var noiseMap = make2DArray(width, height);

    var maxNoiseHeight = Number.MIN_VALUE;
    var minNoiseHeight = Number.MAX_VALUE;

    for (var x = 0; x < map.length; x++) {
        for (var y = 0; y < map[x].length; y++) {
            let amplitude = 1;
            let frequency = 1;
            let noiseHeight = 0;

            for (var i = 0; i < octaves; i++) {
                var sampleX = x / scale * frequency;
                var sampleY = y / scale * frequency;

                var perlinValue = noise(sampleX, sampleY) * 2 - 1;
                noiseHeight += perlinValue * amplitude;
                amplitude *= persistence;
                frequency *= lacunarity;
            }
            if (noiseHeight > maxNoiseHeight) {
                maxNoiseHeight = noiseHeight;
            } else if (noiseHeight < minNoiseHeight) {
                minNoiseHeight = noiseHeight;
            }
            // map[x][y] = noiseHeight;
            noiseMap[x][y] = noiseHeight;
        }
    }
    for (var x = 0; x < map.length; x++) {
        for (var y = 0; y < map[x].length; y++) {
            map[x][y] = (noiseMap[x][y] - minNoiseHeight) / (maxNoiseHeight - minNoiseHeight);

            var drawPoint = yield {
                color: map[x][y] * 255,
                x: x,
                y: y
            };
        }
    }

    if (sendMapTo != null)
        sendMapTo = map;
}

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}
