angular.module('whiteboard.services.receive', [])
.factory('Receive', function (Sockets, EventHandler) {
  Sockets.on('showExisting', function (data) {
    for (socketId in data) {
      if (Object.keys(data[socketId]).length) {
        for (id in data[socketId]) {
          var thisShape = data[socketId][id];
          if (thisShape.tool.name === 'path') {
            EventHandler.drawExistingPath(thisShape);
          } else if (thisShape.initX && thisShape.initY) {
            EventHandler.createShape(id, socketId, thisShape.tool, thisShape.initX, thisShape.initY);
            if (thisShape.tool.name !== 'text') {
              EventHandler.editShape(id, socketId, thisShape.tool, thisShape.mouseX, thisShape.mouseY);
            }
            EventHandler.finishShape(thisShape);
          }
        }
      }
    }
  });

  Sockets.on('socketId', function (data) {
    EventHandler.setSocketId(data.socketId);
  });

  Sockets.on('shapeEdited', function (data) {
    EventHandler.editShape(data.id, data.socketId, data.tool, data.mouseX, data.mouseY);
  });

  Sockets.on('shapeCompleted', function (data) {
    EventHandler.finishShape(data);
  });

  Sockets.on('shapeCreated', function (data) {
    EventHandler.createShape(data.id, data.socketId, data.tool, data.initX, data.initY);
  });

  Sockets.on('shapeMoved', function (data) {
    EventHandler.moveShape(data, data.initX, data.initY);
  });

  Sockets.on('shapeDeleted', function (data) {
    EventHandler.deleteShape(data.id, data.socketId);
  });

  return {};

});
