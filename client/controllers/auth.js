angular.module('whiteboard.auth', [])

  .factory('Auth', function ($http, $window) {

    var storeToken = function (token) {
      $window.localStorage.setItem('token', token);
    };

    var retrieveToken = function (token) {
      return $window.localStorage.getItem('token');
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
