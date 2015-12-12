angular.module('whiteboard')
.directive('wbBoard', ['BoardData', function (BoardData) {
  return {
    restrict: 'A',
    require: ['wbBoard'],
    replace: true,
    template: 
      '<div id="board-container">' +
      '   <div wb-toolbar></div>' +
      '   <div wb-layers></div>' +
      '</div>',
    controller: function () {
      this.handleEvent = function (ev) {
        InputHandler[ev.type](ev);
      }
    },
    link: function (scope, element, attrs, ctrls) {
      var boardCtrl = ctrls[0];
      BoardData.createBoard(element);

      BoardData.$canvas.bind('mousedown mouseup mousemove dblclick', boardCtrl.handleEvent);
    }
  }
}]);
