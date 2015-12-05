angular.module('whiteboard.board', [])

.controller('BoardCtrl', function ($scope, Board, Draw) {
  // Create new board 
  Board.createBoard('board-container', 400, 300);
  // start listening to mouse events
  Board.attachMouseListeners(Draw.startShape);
  // Store some data in the Board factory
  
  Board.canvasX = Board.$el.position().left;
  Board.canvasY = Board.$el.position().top;

  // Select tool
  Board.tool = {
    name: "createLine",
    fill: "red"
  };
});
