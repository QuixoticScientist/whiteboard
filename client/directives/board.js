angular.module('whiteboard')
.directive('wbBoard', [ 'ShapeBuilder', function (ShapeBuilder) {
  return {
    restrict: 'A',
    require: ['wbBoard'],
    replace: true,
    template: 
      '<div id="board-container">' +
      '   <div wb-toolbar></div>' +
      '   <div wb-colorwheel></div>' +
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
      this.createShape = function (ev) {
        mousePosition = {
          x: ev.clientX,
          y: ev.clientY
        };

        $scope.selectedShape.id = ShapeBuilder.generateShapeId();

        var coords = ShapeBuilder.setShape($scope.paper, mousePosition);
        $scope.selectedShape.el = ShapeBuilder.newShape($scope.tool.name, coords.initX, coords.initY);

        // broadcast to server
        Broadcast.newShape($scope.selectedShape.id, $scope.tool.name, coords);

        $scope.selectedShape.coords = coords;
      };
      this.editShape = function (ev) {
        mousePosition = {
          x: ev.clientX,
          y: ev.clientY
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
      ShapeBuilder.raphael = Raphael(document.getElementById('board-container'), 400, 300);

      scope.paper.$canvas = element.find('svg');
      scope.paper.canvasX = scope.paper.$canvas.position().left;
      scope.paper.canvasY = scope.paper.$canvas.position().top;

      boardCtrl = ctrls[0];
      
      scope.paper.$canvas.bind('mousedown', function (ev) {
        boardCtrl.clEvent(ev);
        boardCtrl.createShape(ev);
      });
       scope.paper.$canvas.bind('mousemove', function (ev) {
        boardCtrl.clEvent(ev);
        if (scope.selectedShape.el) {
          boardCtrl.editShape(ev);
        }
      });
      scope.paper.$canvas.bind('mouseup', function (ev) {
        boardCtrl.clEvent(ev);
        boardCtrl.finishShape();
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
      wbColorSelect: '@'  // will this work?
    },
    link: function (scope, element, attrs, ctrls) {
      var boardCtrl = ctrls[0];

      scope.wbToolSelect = scope.wbToolSelect === undefined ? 'line' : scope.wbToolSelect;
      scope.$watch('wbToolSelect', function(newTool, prevTool) {
        boardCtrl.setToolName(newTool);
      }, false);
    }
  };
});
