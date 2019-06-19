var fp = require("find-free-port")
var express = require('express')
var app = express()

app.use(express.static('./'))
let minPort = 9000
fp(minPort, function(err, freePort){
  let openBrowsers = require('open-browsers');

  app.listen(freePort, function () {
    let url = 'http://localhost:' + freePort + '/index.html'
    if (openBrowsers(url)) {
      console.log(`APP listening on port ${freePort}!`)
      console.log(url)
    }
  })
})

