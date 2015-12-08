angular.module('whiteboard')
.directive('wbBoard', function () {
  return {
    restrict: 'A',
    require: ['wbBoard'],
    replace: true,
    template: 
      '<div id="board-container">' +
      '   <div wb-toolbar></div>' +
      '</div>',
    controller: function ($scope, ShapeBuilder, ShapeEditor, Snap, Broadcast) {
      console.log('!')
      $scope.paper = {}
      $scope.tool = {
        name: null,
        fill: 'red'
      };
      $scope.selectedShape = {};

      this.clEvent = function (ev) {
        console.log('Event: ', ev.type);
      };
      this.setToolName = function (tool) {
        $scope.tool.name = tool;
      };
      this.createShape = function (ev) {
        mousePosition = {
          x: ev.clientX,
          y: ev.clientY
        };

        var coords = ShapeBuilder.setShape($scope.paper, mousePosition);
        $scope.selectedShape.el = ShapeBuilder.newShape($scope.tool.name, $scope.paper.raphaelObj, coords.initX, coords.initY);

        // broadcast to server
        Broadcast.newShape($scope.tool.name, $scope.paper.raphaelObj, coords.initX, coords.initY);

        $scope.selectedShape.coords = coords;
      };
      this.editShape = function (ev) {
        mousePosition = {
          x: ev.clientX,
          y: ev.clientY
        };
        ShapeEditor.selectShapeEditor($scope, mousePosition);

        // broadcast to server
        Broadcast.selectShapeEditor($scope, mousePosition);
      };
      this.finishShape = function () {
        Snap.createSnaps($scope.selectedShape.el);
        $scope.selectedShape = {};
      }

    },
    link: function (scope, element, attrs, ctrls) {
      scope.paper.raphaelObj = Raphael(document.getElementById('board-container'), 400, 300);

      scope.paper.$canvas = element.find('svg');
      scope.paper.canvasX = scope.paper.$canvas.position().left;
      scope.paper.canvasY = scope.paper.$canvas.position().top;

      toolbar = element.siblings('.toolbar');

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
})
.directive('wbToolbar', function () {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/toolbar.html',
    require: ['^wbBoard'],
    scope: { 
      wbToolSelect: '@',
    },
    link: function (scope, element, attrs, ctrls) {
      var boardCtrl = ctrls[0];

      scope.wbToolSelect = scope.wbToolSelect === undefined ? 'createLine' : scope.wbToolSelect;
      scope.$watch('wbToolSelect', function(newTool, prevTool) {
        boardCtrl.setToolName(newTool);
      }, false);
    }
  };
});
