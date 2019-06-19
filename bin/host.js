var fp = require("find-free-port")
var express = require('express');
var app = express();

app.use(express.static('./../'));
let minPort = 9000
fp(minPort, function(err, freePort){
  var openBrowsers = require('open-browsers');

  app.listen(freePort, function () {
    if (openBrowsers('http://localhost:' + freePort)) {
      console.log(`APP listening on port ${freePort}!`);
    }
  });
});


