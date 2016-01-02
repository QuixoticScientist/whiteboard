var redis = require("redis");
var client = redis.createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});

module.exports = client;
