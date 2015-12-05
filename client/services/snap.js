angular.module('whiteboard.services.snap', [])
.factory('Snap', function () {

  var createSnaps = function (shape) {
    if (shape.type === 'rect') {
      var x = shape.attr('x');
      var y = shape.attr('y');
      var width = shape.attr('width');
      var height = shape.attr('height');
      var cornerSnaps = [
        [x, y],
        [x + width, y],
        [x, y + height],
        [x + width, y + height]
      ];
      var cardinalSnaps = [
        [x + width / 2, y],
        [x, y + height / 2],
        [x + width, y + height / 2],
        [x + width / 2, y + height],
      ];
      cornerSnaps.forEach(function (snap) {
        this.endSnaps.push(snap);
      }.bind(this));
      cardinalSnaps.forEach(function (snap) {
        this.endSnaps.push(snap);
      }.bind(this));
    } else if (shape.type === 'path') {
      var path = shape.attr('path');
      startPoint = [path[0][1], path[0][2]];
      endPoint = [path[1][1], path[1][2]];
      midPoint = [startPoint[0] + (endPoint[0] - startPoint[0]) / 2, startPoint[1] + (endPoint[1] - startPoint[1]) / 2];
      this.endSnaps.push(startPoint, midPoint, endPoint);
    } else if (shape.type === 'circle') {
      var cx = shape.attr('cx');
      var cy = shape.attr('cy');
      var r = shape.attr('r');
      var centerSnap = [cx, cy];
      cardinalSnaps = [
        [cx + r, cy],
        [cx - r, cy],
        [cx, cy + r],
        [cx, cy - r]
      ];
      this.endSnaps.push(centerSnap);
      cardinalSnaps.forEach(function (snap) {
        this.endSnaps.push(snap);
      }.bind(this));
    }
  };

  var snapToPoints = function (points, x, y, tolerance) {
    if (!this.snapsEnabled) return [x, y];
    for (var i = 0; i < points.length; i++) {
      if (Math.abs(x - points[i][0]) <= tolerance && Math.abs(y - points[i][1]) <= tolerance) {
        return points[i];
      }
    }
    return [x, y];
  };

  return {
    endSnaps: [],
    snapsEnabled: true,
    tolerance: 15,
    createSnaps: createSnaps,
    snapToPoints: snapToPoints
  };

})
