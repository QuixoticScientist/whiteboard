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
  
  describe('GET /getToken', function () {

    it('should get /getToken', function (done) {
      request(serverUrl)
      .get('/getToken')
      .expect(200, done);
    });
  });

});

