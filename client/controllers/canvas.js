angular.module('whiteboard.canvas', [])

  .controller('CanvasController', function ($scope, Canvas) {
    $scope.board = {};

    var socket = io.connect('http://localhost:4000');
    socket.on('test', function (data) {
      console.log(data);
    });

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
