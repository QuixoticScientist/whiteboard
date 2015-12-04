angular.module('whiteboard.canvas', [])

  .controller('CanvasController', function ($scope, Canvas) {
    $scope.board = {};

    // var socket = io.connect('http://localhost:4000');
    // socket.on('test', function (data) {
    //   console.log(data);
    // });

    var socket_connect = function (room) {
      return io('localhost:4000', {
          query: 'r_var='+room
      });
    }

    var random_room = Math.floor((Math.random() * 2) + 1);
    var socket      = socket_connect(random_room);

    socket.emit('chat message', 'hello room #'+random_room);

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
