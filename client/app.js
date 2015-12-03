angular.module('whiteboard', [
  'whiteboard.board',
  'whiteboard.services.board',
  'whiteboard.services.draw',
  'whiteboard.services.snap',
  'whiteboard.services.auth',
  'whiteboard.services.token',
  'ngRoute'
])
.config(['$routeProvider', '$locationProvider', '$httpProvider',
  function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/board.html',
        controller: 'BoardCtrl',
        controllerAs: 'board',
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

