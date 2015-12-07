angular.module('whiteboard.services.sockets', [])
.factory('Sockets', function (socketFactory) {
  var myIoSocket = io.connect();

  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
});
