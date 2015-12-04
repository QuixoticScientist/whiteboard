angular.module('whiteboard.canvas', [])

  .controller('CanvasController', function ($scope, Canvas) {
    $scope.board = {};

    Canvas.getBoard()
      .then(function (board) {
        $scope.board = board;
      })
  })

  .factory('Canvas', function ($http) {
    var getBoard = function () {
      return $http({
        method: 'GET',
        url: '/getBoard'
      }).then(function (res) {
        return res.data;
      })
    };

    return {
      getBoard: getBoard
    };
  });
