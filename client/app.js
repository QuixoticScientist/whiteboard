angular.module('whiteboard', [
  'btford.socket-io',
  //'whiteboard.board',
  //'whiteboard.directives.board',
  'whiteboard.services.board',
  'whiteboard.services.draw',
  'whiteboard.services.snap',
  'whiteboard.services.auth',
  'whiteboard.services.token',
  'whiteboard.services.sockets',
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
        // controller: 'BoardCtrl',
        //controllerAs: 'board',
        authenticate: true
      });

    //$httpProvider.interceptors.push('AttachTokens');

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
}])
.run(function ($rootScope, $location, Auth) {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      Auth.retrieveToken()
        .then(function (token) {
          Auth.storeToken(token);
        })
    }
  });
});
