angular.module('whiteboard', [
  'whiteboard.auth',
  'whiteboard.canvas',
  'ngRoute'])

  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: './views/canvas.html',
        controller: 'CanvasController',
        authenticate: true
      })

      $httpProvider.interceptors.push('AttachTokens');
  })

  .factory('AttachTokens', function ($window) {
    var attach = {
      request: function (object) {
        var jwt = $window.localStorage.getItem('token');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })
  
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
