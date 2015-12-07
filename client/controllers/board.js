angular.module('whiteboard.board', [])

.controller('BoardCtrl', function ($scope, Board, Draw, Sockets) {
  // Create new board 
  Board.createBoard('board-container', 400, 300, Sockets);
  // start listening to mouse events
  Board.attachMouseListeners(Draw.drawShape);
  // Store some data in the Board factory
  
  Board.canvasX = Board.$el.position().left;
  Board.canvasY = Board.$el.position().top;

  // Only for dev purposes, to remove!
  Board.tool = {
    name: "createLine",
    fill: "red"
  };

  $('.toolbar').on('change', function () {
    //console.log($(this))
    Board.tool.name = $(this).find('option:selected').val();
  });
  
  Sockets.on('echo', function () {
    console.log('Echo received from server')
  });
  Sockets.on('createShape', function (data) {
    Draw.createShape(data.tool.name, data.initX, data.initY, data.uniqueId);
  });
  Sockets.on('changeShape', function (data) {
    Draw.createShape(data.tool.name, data.initX, data.initY, data.uniqueId);
  });

});
