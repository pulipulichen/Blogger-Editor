var fp = require("find-free-port")
var express = require('express')
var app = express()
const { exec } = require('child_process');
//const isPortReachable = require('is-port-reachable');

let minPort = 9000
let openBrowser = (freePort) => {
  if (typeof(freePort) !== 'number') {
    freePort = minPort
  }

  let url = 'http://localhost:' + freePort + '/index.html'
  exec(`/opt/google/chrome/google-chrome --app=${url}`)
  /*
  if (openBrowsers(url)) {
    console.log(`APP listening on port ${freePort}!`)
    console.log(url)
  }
  */
}

app.use(express.static('./'))
/*
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
*/
/*
try {
  app.listen(minPort, openBrowser)
} 
catch (e) {
  openBrowser()
}
*/

var isPortTaken = function(port, fn) {
  var net = require('net')
  var tester = net.createServer()
  .once('error', function (err) {
    if (err.code != 'EADDRINUSE') return fn(err)
    fn(null, true)
  })
  .once('listening', function() {
    tester.once('close', function() { fn(null, false) })
    .close()
  })
  .listen(port)
}

isPortTaken(minPort, (error, reachable) => {
  //let reachable = await isPortReachable(minPort, {host: 'localhost'});
  console.log(["reachable", reachable])
  if (reachable === false) {
    app.listen(minPort, openBrowser)
  }
  else {
    openBrowser()
  }
})
  
