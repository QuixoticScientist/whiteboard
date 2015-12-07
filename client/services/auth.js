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

  var generateRandomId = function (length) {
    var id = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
  };

  return {
    isAuth: isAuth,
    logoutUser: logoutUser,
    storeToken: storeToken,
    retrieveToken: retrieveToken,
    generateRandomId: generateRandomId
  };
});
