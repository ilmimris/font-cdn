'use strict';

var env = process.env.NODE_ENV || 'development';
var baseUrl = process.env.BASE_URL || 'http://localhost:3000'
var express = require('express');
var http = require('http');
var fs = require('fs');
var interpolate = require('interpolate');
var app = express();

app.set('port', process.env.PORT || 3000);
app.disable('x-powered-by');

var fontFaceTemplate = fs.readFileSync('./css/font-face-template.css', 'utf8');

var staticMiddleware = express.static('public', {
  dotfiles: 'ignore',
  etag: false,
  index: false,
  maxAge: '30d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set("access-control-allow-origin", "*");
    res.set("timing-allow-origin", "*");
    res.set("x-content-type-options", "nosniff");
    res.set("x-xss-protection", "1; mode=block");
  },
});
app.use(staticMiddleware);

var parseFonts = function(familyQueryString) {
  return familyQueryString.split("|").map(function(familySubstring) {
    return {
      family: familySubstring.split(":")[0],
      weights: familySubstring.split(":")[1].split(","),
    };
  });
}

app.get("/css", function(req, res) {
  res.set("access-control-allow-origin", "*");
  res.set("x-frame-options", "SAMEORIGIN");
  res.set("content-type", "text/css");
  res.set("timing-allow-origin", "*");
  res.set("x-content-type-options", "nosniff");
  res.set("x-xss-protection", "1; mode=block");

  var fonts = parseFonts(req.query.family);
  var css = "";
  fonts.forEach(function(font) {
    font.weights.forEach(function(weight) {
      css += interpolate(fontFaceTemplate, {
        baseUrl: baseUrl,
        fontFamily: font.family,
        fontWeight: weight,
      });
    });
  });
  res.send(css);
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Server listening on port ' + app.get('port'));
});
