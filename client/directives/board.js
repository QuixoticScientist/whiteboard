angular.module('whiteboard')
.directive('wbBoard', ['BoardData', 'Broadcast', 'Receive', function (BoardData) {
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
