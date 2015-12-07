// var mongoose = require('mongoose');

// mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/whiteboard';
// mongoose.connect(mongoURI);

// var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//  console.log('Mongodb connection open');
// });

// module.exports = db;

var redis = require("redis");
var client = redis.createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});

module.exports = client;

// client.set("string key", "string val", redis.print);
// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.hkeys("hash key", function (err, replies) {
//     console.log(replies.length + " replies:");
//     replies.forEach(function (reply, i) {
//         console.log("    " + i + ": " + reply);
//     });
//     client.quit();
// });
