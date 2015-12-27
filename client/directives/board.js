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

      // Required for menu handling
      // BoardData.getCanvas().bind('mouseover', function (ev) {
      //   console.log('mouseover')
      //   scope.$broadcast('menu', {
      //     action: 'close',
      //     ev: ev
      //   });
      // });      
    }
  }
}]);
