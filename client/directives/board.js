angular.module('whiteboard')
.directive('wbBoard', ['BoardData', 'Broadcast', function (BoardData) {
  return {
    restrict: 'A',
    require: ['wbBoard'],
    replace: true,
    template: 
      '<div id="board-container">' +
      '   <div wb-toolbar></div>' +
      '   <div wb-layers></div>' +
      '</div>',
    controller: function (InputHandler) {
      this.handleEvent = function (ev) {
        InputHandler[ev.type](ev);
      }
      // $scope.paper = {};
      // $scope.tool = {
      //   name: null,
      //   colors: {
      //     fill: 'transparent',
      //     stroke: '#000000'
      //   }
      // };
      // $scope.selectedShape = {};

      // this.clEvent = function (ev) {
        //console.log('Event: ', ev.type);
      // };
      // this.setToolName = function (tool) {
      //   $scope.tool.name = tool; 
      // };

      // this.setColors = function (fill, stroke) {
      //   $scope.tool.colors.fill = fill;
      //   $scope.tool.colors.stroke = stroke; 
      // };

      // this.setZoomScale = function (scale) {
      //   $scope.paper.scalingFactor = 1 / scale;
      //   this.zoom();
      // };

      // this.zoom = function (ev) {
      //   var paper = $scope.paper;
        
      //   var originalWidth = paper.width;
      //   var originalHeight = paper.height;

      //   if (ev) {
      //     var mousePosition = {
      //       x: (ev.clientX - paper.canvasX) * paper.scalingFactor + paper.offsetX,
      //       y: (ev.clientY - paper.canvasY) * paper.scalingFactor + paper.offsetY
      //     };
      //   }

      //   paper.width = paper.sizeX * paper.scalingFactor;
      //   paper.height = paper.sizeY * paper.scalingFactor;
      //   if (ev) {
      //     paper.offsetX = mousePosition.x - paper.width / 2;
      //     paper.offsetY = mousePosition.y - paper.height / 2;
      //   } else {
      //     paper.offsetX = paper.offsetX + originalWidth / 2 - paper.width / 2;
      //     paper.offsetY = paper.offsetY + originalHeight / 2 - paper.height / 2;
      //   }
      //   ShapeBuilder.raphael.setViewBox(paper.offsetX, paper.offsetY, paper.width, paper.height);
      // };

      // this.createShape = function (ev) {
      //   var mousePosition = {
      //     x: (ev.clientX - $scope.paper.canvasX) * $scope.paper.scalingFactor + $scope.paper.offsetX,
      //     y: (ev.clientY - $scope.paper.canvasY) * $scope.paper.scalingFactor + $scope.paper.offsetY
      //   };

      //   $scope.selectedShape.id = ShapeBuilder.generateShapeId();
        
      //   var coords = ShapeBuilder.setShape($scope.paper, mousePosition);
      //   $scope.selectedShape.el = ShapeBuilder.newShape($scope.tool.name, coords.initX, coords.initY, $scope.tool.colors);

      //   // broadcast to server
      //   Broadcast.newShape($scope.selectedShape.id, $scope.tool.name, coords, $scope.tool.colors);

      //   $scope.selectedShape.coords = coords;

      //   ShapeBuilder.storeOnEditShape(Broadcast.getSocketId(), $scope.selectedShape);
      // };

      // this.editShape = function (ev) {
        // var mousePosition = {
        //   x: (ev.clientX - $scope.paper.canvasX) * $scope.paper.scalingFactor + $scope.paper.offsetX,
        //   y: (ev.clientY - $scope.paper.canvasY) * $scope.paper.scalingFactor + $scope.paper.offsetY
        // };

        // var infoForClient = {
        //   shape: $scope.selectedShape.el,
        //   coords: $scope.selectedShape.coords,
        //   initCoords: $scope.paper
        // };
        // var infoForServer = {
        //   shapeId: $scope.selectedShape.id,
        //   tool: $scope.tool.name,
        //   coords: $scope.selectedShape.coords,
        //   initCoordX: $scope.paper.canvasX,
        //   initCoordY: $scope.paper.canvasY
        // };
  
        // ShapeEditor.selectShapeEditor($scope.tool.name, infoForClient, mousePosition);
        // broadcast to server
      //   Broadcast.selectShapeEditor(infoForServer, mousePosition);
      // };
      // this.finishShape = function () {
      //   Snap.createSnaps($scope.selectedShape.el);
      //   ShapeManipulation.pathSmoother($scope.tool.name, $scope.selectedShape.el);
      //   Broadcast.completeShape($scope.selectedShape.id);
      //   $scope.selectedShape = {};
      // };
      //onkeypress listener is for text entry
      document.onkeypress = function(e) {
        var currentShape = $scope.selectedShape.el;
        if (currentShape && currentShape.type === 'text') {
          if (currentShape.attr('text') === 'Insert Text') {
            currentShape.attr('text', '');
          }
          if (e.keyCode === 8) {
            currentShape.attr('text', currentShape.attr('text').slice(0, currentShape.attr('text').length - 1));
          } else {
            currentShape.attr('text', currentShape.attr('text') + String.fromCharCode(e.keyCode));
          }
        }
      };
      //onkeydown listener is solely for backspace
      document.onkeydown = function(e) {
        if (e.which === 8) {
          e.preventDefault();
          var currentShape = $scope.selectedShape.el;
          if (currentShape && currentShape.type === 'text') {
            currentShape.attr('text', currentShape.attr('text').slice(0, currentShape.attr('text').length - 1));
          }
        }
      };

    },
    link: function (scope, element, attrs, ctrls) {
      var boardCtrl = ctrls[0];
      BoardData.createBoard(element);
      BoardData.getCanvas().bind('mousedown mouseup mousemove dblclick', boardCtrl.handleEvent);
    }
  }
}])
.directive('wbToolbar', ['BoardData', function (BoardData) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/toolbar.html',
    require: ['^wbBoard'],
    scope: { 
      wbToolSelect: '@',
      wbZoomScale: '@',
      wbColorSelect: '@'
    },
    link: function (scope, element, attrs, ctrls) {
      scope.wbZoomScaleDown = function () {
        scope.wbZoomScale -= 0.25;
      };

      scope.wbZoomScaleUp = function () {
        scope.wbZoomScale += 0.25;
      };

      scope.wbToolSelect = scope.wbToolSelect === undefined ? 'line' : scope.wbToolSelect;
      scope.$watch('wbToolSelect', function(newTool, prevTool) {
        BoardData.setCurrentToolName(newTool);
      }, false);
      
      scope.wbFillColorSelect = scope.wbFillColorSelect === undefined ? 'transparent' : scope.wbFillColorSelect;
      scope.wbStrokeColorSelect = scope.wbStrokeColorSelect === undefined ? '#000000' : scope.wbStrokeColorSelect;
      // scope.wbColorSelect = scope.wbColorSelect === undefined ? '#000000' : scope.wbColorSelect;
      scope.$watchGroup(['wbFillColorSelect', 'wbStrokeColorSelect'], function(vals) {
        console.log('Fill: ', vals[0], ' Stroke: ', vals[1]);
        BoardData.setColors(vals[0], vals[1]);
      }, false);
      
      scope.wbZoomScale = scope.wbZoomScale === undefined ? 1 : scope.wbZoomScale;
      scope.$watch('wbZoomScale', function(newScale, prevScale) {
        if (newScale != 0 && !isNaN(newScale)) {
          BoardData.setZoomScale(newScale);
        }
      }, false);
    }
  };
}]);
