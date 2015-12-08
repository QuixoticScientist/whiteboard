angular.module('whiteboard.services.snap', [])
.factory('Snap', function () {
  
  function Point (x, y) {
    this.x = x;
    this.y = y;
  }

  function Node (val, left, right) {
    this.val = val;
    this.left = left || null;
    this.right = right || null;
  }

  function Rectangle (x0, y0, x1, y1) {
    this.left = x0;
    this.bottom = y0;
    this.right = x1;
    this.top = y1;
  }

  function KDTree (points, depth) {
    var split, sortedPoints;
    points = points || generatePoints(10);
    depth = depth || 0;
    if (points.length <= 1) {
      return points[0];
    }
    else {
      var mid = Math.ceil(points.length / 2);
      if ((depth % 2) === 0) {
        sortedPoints = points.slice().sort(function (a,b) {
          return a.x - b.x;
        });
        split = sortedPoints[mid].x;
      } else {
        sortedPoints = points.slice().sort(function (a,b) {
          return a.y - b.y;
        });
        split = sortedPoints[mid].y;
      }
      var left = new KDTree(sortedPoints.slice(0, mid), depth + 1);
      var right = new KDTree(sortedPoints.slice(mid), depth + 1);
      return new Node(split, left, right);
    }
  }

  function reportSubtree (node) {
    if (node instanceof Node) {
      var returnArr = [];
      return returnArr.concat(reportSubtree(node.left), reportSubtree(node.right));
    } else {
      return node;
    }
  }

  function pointIsInRange (point, range) {
    return point.x >= range.left && point.x <= range.right && point.y >= range.bottom && point.y <= range.top;
  }

  function regionIntersection (r1, r2) {
    var left = Math.max(r1.left, r2.left);
    var bottom = Math.max(r1.bottom, r2.bottom);
    var right = Math.min(r1.right, r2.right);
    var top = Math.min(r1.top, r2.top);
    if (right < left || top < bottom) {
      return null;
    } else {
      return new Rectangle(left, bottom, right, top);
    }
  }

  function regionContainedInRange (region, range) {
    return region.left > range.left && region.bottom > range.bottom && region.right < range.right && region.top < range.top;
  }

  function searchKDTree (node, range, nodeRange, depth) {
    depth = depth || 0;
    nodeRange = nodeRange || new Rectangle(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    // base case if node is a leaf
    if (typeof node.x === 'number' && typeof node.y === 'number') {
      if (pointIsInRange(node, range)) {
        return node;
      }
    } else {
      var leftRange = new Rectangle(nodeRange.left, nodeRange.bottom, nodeRange.right, nodeRange.top);
      var rightRange = new Rectangle(nodeRange.left, nodeRange.bottom, nodeRange.right, nodeRange.top);
      if ((depth % 2) === 0) {
        // split on x
        leftRange.right = node.val;
        rightRange.left = node.val;
      } else {
        // split on y
        leftRange.top = node.val;
        rightRange.bottom = node.val;
      }
      var returnArr = [];
      var subtreeNodes;
      /*check if left region is fully contained in range*/
      if (regionContainedInRange(leftRange, range)) {
        subtreeNodes = reportSubtree(node.left);
        if (subtreeNodes) returnArr = returnArr.concat(subtreeNodes);
      /*else check if left region intersects range*/
      } else if (regionIntersection(leftRange, range)) {
        subtreeNodes = searchKDTree(node.left, range, leftRange, depth + 1);
        if (subtreeNodes) returnArr = returnArr.concat(subtreeNodes);
      }
      /*check if right region is fully contained in range*/
      if (regionContainedInRange(rightRange, range)) {
        subtreeNodes = reportSubtree(node.right);
        if (subtreeNodes) returnArr = returnArr.concat(subtreeNodes);
      /*else check if right region intersects range*/
      } else if (regionIntersection(rightRange, range)) {
        subtreeNodes = searchKDTree(node.right, range, rightRange, depth + 1);
        if (subtreeNodes) returnArr = returnArr.concat(subtreeNodes);
      }
      return returnArr;
    }
  }

  var createSnaps = function (shape) {
    if (shape.type === 'rect') {
      var x = shape.attr('x');
      var y = shape.attr('y');
      var width = shape.attr('width');
      var height = shape.attr('height');
      var cornerSnaps = [
        new Point(x, y),
        new Point(x + width, y),
        new Point(x, y + height),
        new Point(x + width, y + height)
      ];
      var cardinalSnaps = [
        new Point(x + width / 2, y),
        new Point(x, y + height / 2),
        new Point(x + width, y + height / 2),
        new Point(x + width / 2, y + height),
      ];
      cornerSnaps.forEach(function (snap) {
        this.endSnaps.push(snap);
      }.bind(this));
      cardinalSnaps.forEach(function (snap) {
        this.endSnaps.push(snap);
      }.bind(this));
    } else if (shape.type === 'path') {
      var path = shape.attr('path');
      if (path[1]) {
        startPoint = new Point(path[0][1], path[0][2]);
        endPoint = new Point(path[1][1], path[1][2]);
        midPoint = new Point(startPoint.x + (endPoint.x - startPoint.x) / 2, startPoint.y + (endPoint.y - startPoint.y) / 2);
        this.endSnaps.push(startPoint, midPoint, endPoint);
      } else {
        //this line has no length, delete it
        shape.remove();
      }
    } else if (shape.type === 'circle') {
      var cx = shape.attr('cx');
      var cy = shape.attr('cy');
      var r = shape.attr('r');
      var centerSnap = new Point(cx, cy);
      cardinalSnaps = [
        new Point(cx + r, cy),
        new Point(cx - r, cy),
        new Point(cx, cy + r),
        new Point(cx, cy - r)
      ];
      this.endSnaps.push(centerSnap);
      cardinalSnaps.forEach(function (snap) {
        this.endSnaps.push(snap);
      }.bind(this));
    }
    this.endSnapTree = new KDTree(this.endSnaps);
    console.log(this.endSnapTree);
  };

  var snapToPoints = function (x, y) {
    if (!this.snapsEnabled) return [x, y];
    if (!this.endSnaps.length) return [x, y];
    var searchBox = new Rectangle(x - this.tolerance, y - this.tolerance, x + this.tolerance, y + this.tolerance);
    var localTree = searchKDTree(this.endSnapTree, searchBox);
    for (var i = 0; i < localTree.length; i++) {
      var pointX = localTree[i].x;
      var pointY = localTree[i].y;
      var dist = Math.sqrt(Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2));
      if (!closest || dist < closestDist) {
        var closest = localTree[i];
        var closestDist = dist;
      }
    }
    if (closest) {
      return [closest.x, closest.y];
    } else {
      return [x,y];
    }
  };

  return {
    endSnaps: [],
    snapsEnabled: true,
    tolerance: 15,
    createSnaps: createSnaps,
    snapToPoints: snapToPoints
  };

})
