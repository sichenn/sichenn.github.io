function ease(percent, easeAmount) {
  var a = easeAmount + 1;
  return pow(percent, a) / (pow(percent, a) + pow(1 - percent, a));
}

function rotate2DVector(vector, angle) {
    var newX = cos(angle)*vector.x - sin(angle) * vector.y;
    var newY = sin(angle) * vector.x + cos(angle) * vector.y;
    return createVector(newX, newY);
}

function inBounds(x,y, minX, maxX, minY, maxY) {
  return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}
