var express = require('express');
var app = express();
var handle = require('./request-handler');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', handle.signupUser);


var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Server is listening')
});
