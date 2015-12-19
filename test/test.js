var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;

var db = require('./../server/db/config');
var Board = require('./../server/db/models/board');

var request = require('supertest');
var server = require('./../server/server');
var serverUrl = 'http://localhost:3000';

describe('HTTP', function () {
  before(function () {
    server.start();
  });

  after(function () {
    server.end();
  });
  
  describe('GET /:id', function () {

    it('should get /:id', function (done) {
      var id = '';
      var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var length = 5;
      for (var i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      request(serverUrl)
      .get('/:' + id)
      .expect(200, done);
    });
  });

});
//
