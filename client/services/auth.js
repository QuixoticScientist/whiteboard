angular.module('whiteboard.services.auth', [])
.factory('Auth', function ($http, $window) {

  var storeToken = function (token) {
    $window.localStorage.setItem('token', token);
  };

  var retrieveToken = function () {
    return $http({
      method: 'GET', 
      url: '/getToken'
    }).then(function (res) {
      return res.data.token;
    })
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('token');
  };

  var logoutUser = function() {
    $window.localStorage.removeItem('token');
  };

  return {
    isAuth: isAuth,
    logoutUser: logoutUser,
    storeToken: storeToken,
    retrieveToken: retrieveToken
  };
});
