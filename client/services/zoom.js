angular.module('whiteboard.services.zoom', [])
.factory('Zoom', [function () {
  zoom = function (ev) {
    // var paper = $scope.paper;
    
    // var originalWidth = paper.width;
    // var originalHeight = paper.height;

    // if (ev) {
    //   var mousePosition = {
    //     x: (ev.clientX - paper.canvasX) * paper.scalingFactor + paper.offsetX,
    //     y: (ev.clientY - paper.canvasY) * paper.scalingFactor + paper.offsetY
    //   };
    // }

    // paper.width = paper.sizeX * paper.scalingFactor;
    // paper.height = paper.sizeY * paper.scalingFactor;
    // if (ev) {
    //   paper.offsetX = mousePosition.x - paper.width / 2;
    //   paper.offsetY = mousePosition.y - paper.height / 2;
    // } else {
    //   paper.offsetX = paper.offsetX + originalWidth / 2 - paper.width / 2;
    //   paper.offsetY = paper.offsetY + originalHeight / 2 - paper.height / 2;
    // }
    // ShapeBuilder.raphael.setViewBox(paper.offsetX, paper.offsetY, paper.width, paper.height);
  };
  return {
    zoom: zoom
  }
}]);
