angular.module('whiteboard')
.directive('wbBoard', ['BoardData', 'Broadcast', 'Receive', 'LeapMotion', function (BoardData) {
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
    },
    link: function (scope, element, attrs, ctrls) {
      var boardCtrl = ctrls[0];
      BoardData.createBoard(element);
      BoardData.getCanvas().bind('mousedown mouseup mousemove dblclick', boardCtrl.handleEvent);

      $('body').on('keypress', function (ev) {
        boardCtrl.handleEvent(ev);
      });

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
      wbStrokeWidth: '@',
      wbColorSelect: '@'
    },
    link: function (scope, element, attrs, ctrls) {
      scope.wbStrokeWidthDown = function () {
        if (scope.wbStrokeWidth > 0.25) scope.wbStrokeWidth -= 0.25;
      };

      scope.wbStrokeWidthUp = function () {
        scope.wbStrokeWidth += 0.25;
      };

      scope.wbToolSelect = scope.wbToolSelect === undefined ? 'move' : scope.wbToolSelect;
      scope.$watch('wbToolSelect', function(newTool, prevTool) {
        BoardData.setCurrentToolName(newTool);
      }, false);
      
      scope.wbFillColorSelect = scope.wbFillColorSelect === undefined ? 'transparent' : scope.wbFillColorSelect;
      scope.wbStrokeColorSelect = scope.wbStrokeColorSelect === undefined ? '#000000' : scope.wbStrokeColorSelect;
      // scope.wbColorSelect = scope.wbColorSelect === undefined ? '#000000' : scope.wbColorSelect;
      scope.$watchGroup(['wbFillColorSelect', 'wbStrokeColorSelect'], function(vals) {
        //console.log('Fill: ', vals[0], ' Stroke: ', vals[1]);
        BoardData.setColors(vals[0], vals[1]);
      }, false);
      
      scope.wbStrokeWidth = scope.wbStrokeWidth === undefined ? 1 : scope.wbStrokeWidth;
      scope.$watch('wbStrokeWidth', function(newScale, prevScale) {
        BoardData.setStrokeWidth(newScale);
      }, false);
    }
  };
}]);
