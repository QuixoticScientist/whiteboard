angular.module('whiteboard.services.sockets', [])
.factory('Sockets', function (socketFactory) {
  var mySocket = socketFactory();

  return mySocket;
});
