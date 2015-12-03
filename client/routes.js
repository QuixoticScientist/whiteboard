angular.module('whiteboard', [
  'whiteboard.canvas',
  'whiteboard.login',
  'whiteboard.signup'])
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: './views/canvas.html',
        controller: 'CanvasController',
        authenticate: true
      })
      .when('/login', {
        templateUrl: './views/login.html',
        controller: 'LoginController'
      })
      .when('/signup', {
        templateUrl: './views/signup.html',
        controller: 'SignupController'
      })
  });
