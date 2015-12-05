var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;

var db = require('./../server/db/config');
var Board = require('./../server/db/models/board');

var request = require('supertest');
var server = 'http://localhost:3000'

describe('GET /getToken', function () {
  it('should get /getToken', function (done) {
    request(server)
    .get('/getToken')
    .expect(200, done);
  });
});

