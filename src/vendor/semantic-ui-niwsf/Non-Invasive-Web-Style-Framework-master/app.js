var express = require('express');
var fs = require('fs');
var app = express();
app.use(express.static('public'));
var PuliString = require('./utils/puli-string.js');

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function (req, res) {
  res.send(fs.readFileSync("index.html", "utf8"))
})

app.get('/raw.html', function (req, res) {
  var fileDir = "html-template/"
  var fileList = [
    "header-1.html",
    "style-framework.html",
    "header-2.html",
    //"main-raw-header.html",
    //"main.html",
    "main-raw-header.html",
    "main.html",
    "footer.html"
  ]
  var data = []
  for (var i = 0; i < fileList.length; i++) {
    data.push(fs.readFileSync(fileDir + fileList[i], "utf8"))
  }
  res.set('Content-Type', 'text/html')
  res.send(data.join("\n"));
})

app.get('/origin.html', function (req, res) {
  var fileDir = "html-template/"
  var fileList = [
    "header-1.html",
    "origin-framework.html",
    "header-2.html",
    //"main-raw-header.html",
    //"main.html",
    "main-framework-header.html",
    "main.html",
    //"main-footer.html",
    "footer.html"
  ]
  var data = []
  for (var i = 0; i < fileList.length; i++) {
    data.push(fs.readFileSync(fileDir + fileList[i], "utf8"))
  }
  res.set('Content-Type', 'text/html')
  res.send(data.join("\n"));
})

app.get('/framework.html', function (req, res) {
  var fileDir = "html-template/"
  var fileList = [
    "header-1.html",
    "style-framework.html",
    "header-2.html",
    //"main-raw-header.html",
    //"main.html",
    "main-framework-header.html",
    "main.html",
    //"main-footer.html",
    "footer.html"
  ]
  var data = []
  for (var i = 0; i < fileList.length; i++) {
    data.push(fs.readFileSync(fileDir + fileList[i], "utf8"))
  }
  res.set('Content-Type', 'text/html')
  res.send(data.join("\n"));
})

app.get('/semantic.niwsf.css', function (req, res) {
  var fileDir = "static/semantic-ui/"
  
  var cssHeader = fs.readFileSync(fileDir + "semantic.header.css", "utf8")
  var cssReset = fs.readFileSync(fileDir + "semantic.reset.css", "utf8")
  cssReset = PuliString.removeComment(cssReset)
  cssReset = PuliString.removeEmptyLine(cssReset)
  //cssReset = PuliString.countBracketStartIsNotInLineEnd(cssReset)
  cssReset = PuliString.reformatSelector(cssReset)
  
  var cssSemantic = fs.readFileSync(fileDir + "semantic.main.css", "utf8")
  cssSemantic = PuliString.removeCommentString(cssSemantic)
  cssSemantic = PuliString.removeEmptyLine(cssSemantic)
  //cssReset = PuliString.countBracketStartIsNotInLineEnd(cssReset)
  cssSemantic = PuliString.reformatRules(cssSemantic)
  
  var cssExtra = fs.readFileSync(fileDir + "semantic.extra.css", "utf8")
  var data = cssHeader + cssReset + cssSemantic + cssExtra
  
  //var data = fs.readFileSync(fileDir + "semantic.raw.css", "utf8")
  res.set('Content-Type', 'text/css')
  res.send(data);
})

app.use('/themes', express.static(__dirname + '/static/semantic-ui/themes'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})
