angular.module('whiteboard.services.receive', [])
.factory('Receive', function (Sockets) {

  Sockets.on('shapeUpdate', function (data) {
    console.log(data);
  });

});
