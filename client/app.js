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
.controller('BoardCtrl', function ($scope) {
  $scope.canvasClick = function () {
    console.log('Clicked a Canvas!')
  };
  $scope.circleClick = function () {
    console.log('Clicked a Circle?')
  };
});
