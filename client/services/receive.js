angular.module('whiteboard.services.receive', [])
.factory('Receive', function (Sockets, EventHandler) {
  Sockets.on('showExisting', function (data) {
    console.log(data);
    for (socketId in data) {
      if (Object.keys(data[socketId]).length) {
        for (shapeId in data[socketId]) {
          var thisShape = data[socketId][shapeId];
          if (thisShape.tool.name === 'path') {
            EventHandler.drawExistingPath(thisShape);
            EventHandler.finishShape(thisShape);
          } else if (thisShape.initX && thisShape.initY) {
            EventHandler.createShape(shapeId, socketId, thisShape.tool, thisShape.initX, thisShape.initY);
            if (thisShape.tool.name !== 'text') {
              EventHandler.editShape(shapeId, socketId, thisShape.tool, thisShape.mouseX, thisShape.mouseY);
            }
            console.log(thisShape);
            EventHandler.finishShape(thisShape);
          }
        }
      }
    }
  });

  Sockets.on('socketId', function (data) {
    EventHandler.setSocketID(data.socketId);
  });

  Sockets.on('shapeEdited', function (data) {
    EventHandler.editShape(data.shapeId, data.socketId, data.tool, data.mouseX, data.mouseY);
  });

  Sockets.on('shapeCompleted', function (data) {
    EventHandler.finishShape(data);
  });

  Sockets.on('shapeCreated', function (data) {
    EventHandler.createShape(data.shapeId, data.socketId, data.tool, data.initX, data.initY);
  });

  Sockets.on('shapeMoved', function (data) {
    EventHandler.moveShape(data.shapeId, data.socketId, data.initX, data.initY);
  });

  Sockets.on('shapeDeleted', function (data) {
    EventHandler.deleteShape(data.shapeId, data.socketId);
  });

  return {};

});
