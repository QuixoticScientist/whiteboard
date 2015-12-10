angular.module('whiteboard', [
  'btford.socket-io',
  'whiteboard.services.shapebuilder',
  'whiteboard.services.shapeeditor',
  'whiteboard.services.shapemanipulation',
  'whiteboard.services.snap',
  'whiteboard.services.auth',
  'whiteboard.services.token',
  'whiteboard.services.sockets',
  'whiteboard.services.broadcast',
  'colorpicker.module',
  'ngRoute'
])
.config(['$routeProvider', '$locationProvider', '$httpProvider',
  function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        resolve: {
          'something': function (Sockets, Auth, $location) {
            var roomId = Auth.generateRandomId(5);
            Sockets.emit('roomId', {roomId: roomId});
            $location.path('/' + roomId);
          }
        }
      })
      .when('/:id', {
        templateUrl: 'views/board.html',
        resolve: {
          'somethingElse': function (Sockets, $location) {
            Sockets.emit('roomId', {roomId: $location.path().slice(1)});
          }
        },
        authenticate: true
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
}]);
