function Event(point, placeEvent) {
  this.point = point;
  this.placeEvent = placeEvent;
  this.y = point.y;
  var arch;
}

Event.prototype.compareTo = function(other) {
  // TODO: implement
  return this.y > other.y ? 1 : -1;
};
