function Edge (s, a, b){
    this.left = a;
    this.right = b;
    this.start = s;
    this.end = null;
    this.f = (b.x - a.x)/(a.y-b.y);
    this.g = s.y - f * s.x;
    this.direction = createVector(b.y - a.y,  -(b.x - a.x));

    var neighbor;
    var intersected, iCounted;
}
