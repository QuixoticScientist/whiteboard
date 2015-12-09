angular.module('whiteboard')
.directive('wbBoard', [ 'ShapeBuilder', function (ShapeBuilder) {
  return {
    restrict: 'A',
    require: ['wbBoard'],
    replace: true,
    template: 
      '<div id="board-container">' +
      '   <div wb-toolbar></div>' +
      '</div>',
    controller: function ($scope, ShapeEditor, Snap, Broadcast) {
      $scope.paper = {}
      $scope.tool = {
        name: null,
        fill: 'red'
      };
      $scope.selectedShape = {};

      this.clEvent = function (ev) {
        //console.log('Event: ', ev.type);
      };
      this.setToolName = function (tool) {
        $scope.tool.name = tool; 
      };
      this.setZoomScale = function (scale) {
        $scope.paper.scalingFactor = 1 / scale;
      }
      this.createShape = function (ev) {
        var mousePosition = {
          x: (ev.clientX - $scope.paper.canvasX) * $scope.paper.scalingFactor + $scope.paper.offsetX,
          y: (ev.clientY - $scope.paper.canvasY) * $scope.paper.scalingFactor + $scope.paper.offsetY
        };

        $scope.selectedShape.id = ShapeBuilder.generateShapeId();

        var coords = ShapeBuilder.setShape($scope.paper, mousePosition);
        $scope.selectedShape.el = ShapeBuilder.newShape($scope.tool.name, coords.initX, coords.initY);

        // broadcast to server
        Broadcast.newShape($scope.selectedShape.id, $scope.tool.name, coords);

        $scope.selectedShape.coords = coords;
      };
      this.editShape = function (ev) {
        var mousePosition = {
          x: (ev.clientX - $scope.paper.canvasX) * $scope.paper.scalingFactor + $scope.paper.offsetX,
          y: (ev.clientY - $scope.paper.canvasY) * $scope.paper.scalingFactor + $scope.paper.offsetY
        };

        var infoForClient = {
          shape: $scope.selectedShape.el,
          coords: $scope.selectedShape.coords,
          initCoords: $scope.paper,
          fill: $scope.tool.fill
        };
        var infoForServer = {
          shapeId: $scope.selectedShape.id,
          tool: $scope.tool.name,
          coords: $scope.selectedShape.coords,
          initCoordX: $scope.paper.canvasX,
          initCoordY: $scope.paper.canvasY,
          fill: $scope.tool.fill
        };
  
        //ShapeEditor.selectShapeEditor(infoForClient, mousePosition);
        ShapeEditor.selectShapeEditor($scope.tool.name, infoForClient, mousePosition);
        // broadcast to server
        Broadcast.selectShapeEditor(infoForServer, mousePosition);
      };
      this.finishShape = function () {
        Snap.createSnaps($scope.selectedShape.el);
        $scope.selectedShape = {};
        Broadcast.completeShape();
      }

    },
    link: function (scope, element, attrs, ctrls) {
      var sizeX = 400;
      var sizeY = 400;
      ShapeBuilder.raphael = Raphael(document.getElementById('board-container'), sizeX, sizeY);

      scope.paper.$canvas = element.find('svg');
      scope.paper.canvasX = scope.paper.$canvas.position().left;
      scope.paper.canvasY = scope.paper.$canvas.position().top;
      scope.paper.offsetX = 0;
      scope.paper.offsetY = 0;
      scope.paper.scalingFactor = 1;

      boardCtrl = ctrls[0];

      function zoom (ev) {
        var mousePosition = {
          x: (ev.clientX - scope.paper.canvasX) * scope.paper.scalingFactor + scope.paper.offsetX,
          y: (ev.clientY - scope.paper.canvasY) * scope.paper.scalingFactor + scope.paper.offsetY
        };

        var width = sizeX * scope.paper.scalingFactor;
        var height = sizeY * scope.paper.scalingFactor;
        scope.paper.offsetX = mousePosition.x - width / 2;
        scope.paper.offsetY = mousePosition.y - height / 2;
        ShapeBuilder.raphael.setViewBox(scope.paper.offsetX, scope.paper.offsetY, width, height);
      }
      scope.paper.$canvas.bind('mousedown', function (ev) {
        boardCtrl.clEvent(ev);
        if (scope.tool.name === 'zoom') {
          zoom(ev);
        } else {
          boardCtrl.createShape(ev);
        }
      });
      scope.paper.$canvas.bind('mousemove', function (ev) {
        boardCtrl.clEvent(ev);
        if (scope.selectedShape.el) {
          boardCtrl.editShape(ev);
        }
      });
      scope.paper.$canvas.bind('mouseup', function (ev) {
        boardCtrl.clEvent(ev);
        if (scope.tool.name !== 'zoom') {
          boardCtrl.finishShape();
        }
      });
    }
  };
}])
.directive('wbToolbar', function () {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/toolbar.html',
    require: ['^wbBoard'],
    scope: { 
      wbToolSelect: '@',
      wbZoomScale: '@'
    },
    link: function (scope, element, attrs, ctrls) {
      var boardCtrl = ctrls[0];

      scope.wbToolSelect = scope.wbToolSelect === undefined ? 'line' : scope.wbToolSelect;
      scope.$watch('wbToolSelect', function(newTool, prevTool) {
        boardCtrl.setToolName(newTool);
      }, false);
      
      scope.wbZoomScale = scope.wbZoomScale === undefined ? 1 : scope.wbZoomScale;
      scope.$watch('wbZoomScale', function(newScale, prevScale) {
        boardCtrl.setZoomScale(newScale);
      }, false);
    }
  };
});
