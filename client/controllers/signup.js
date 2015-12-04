angular.module('whiteboard.signup', [])

  .controller('SignupController', function ($scope, Signup, Auth) {
    
    $scope.signupUser = function () {
      Signup.signupUser($scope.email, $scope.password).
        then(function (token) {
          Auth.storeToken(token);
        });
    }
  })

  .factory('Signup', function ($http, $location) {

    var signupUser = function (email, password) {
      return $http({
        method: 'POST', 
        url: '/signup',
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
      signupUser: signupUser
    };
  });
