angular.module('whiteboard', ['ngRoute'])
.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'board.html',
        controller: 'BoardCtrl',
        controllerAs: 'board'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
}])
.controller('BoardCtrl', ['$route', '$routeParams', '$location',
  function($route, $routeParams, $location) {
    this.$route = $route;
    this.$location = $location;
    this.$routeParams = $routeParams;
}]);
