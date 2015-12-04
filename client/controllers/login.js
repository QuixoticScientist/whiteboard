angular.module('whiteboard.login', [])

  .controller('LoginController', function ($scope, Login, Auth) {
    
    $scope.loginUser = function () {
      Login.loginUser($scope.email, $scope.password)
        .then(function(token) {
          Auth.storeToken(token);
        });
    }
  })

  .factory('Login', function ($http, $location) {

    var loginUser = function (email, password) {
      return $http({
        method: 'POST', 
        url: '/login',
        data: {
          email: email,
          password: password
        }
      }).then(function (res) {
        $location.path('/');
        return res.data.token;
      })
    };

    return {
      loginUser: loginUser
    };
  });
