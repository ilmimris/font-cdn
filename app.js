'use strict';

var env = process.env.NODE_ENV || 'development';
var baseUrl = process.env.BASE_URL || 'http://localhost:3000'
var express = require('express');
var http = require('http');
var fs = require('fs');
var interpolate = require('interpolate');
var glob = require("glob");
var app = express();

app.set('port', process.env.PORT || 3000);
app.disable('x-powered-by');

var fontFaceTemplate = fs.readFileSync('./css/font-face-template.css', 'utf8');

// TOOD extract this into module
var availableFonts = {};
glob.sync("./public/fonts/*.@(woff|woff2)").forEach(function(fontPath) {
  var filename = fontPath.replace("./public/fonts/", "").replace(/\.woff2?$/, "");
  var family = filename.split("-")[0];
  var weight = filename.split("-")[1];
  availableFonts[family] = availableFonts[family] || [];
  if (availableFonts[family].indexOf(weight) === -1) {
    availableFonts[family].push(weight);
  }
});
console.log("Available fonts: ", JSON.stringify(availableFonts, null, 2));

// TOOD extract this into module
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

// TOOD extract this into module
var parseFonts = function(familyQueryString) {
  return familyQueryString.split("|").map(function(familySubstring) {
    return {
      family: familySubstring.split(":")[0],
      weights: familySubstring.split(":")[1].split(","),
    };
  });
};

// TOOD extract most of this into above font query string parser module
app.get("/css", function(req, res, next) {
  res.set("access-control-allow-origin", "*");
  res.set("x-frame-options", "SAMEORIGIN");
  res.set("content-type", "text/css");
  res.set("timing-allow-origin", "*");
  res.set("x-content-type-options", "nosniff");
  res.set("x-xss-protection", "1; mode=block");

  var familyQueryString = req.query.family;
  if (!familyQueryString || familyQueryString === "") {
    res.send("Must provide `family` query param.");
    return next();
  }
  var fonts;
  try {
    fonts = parseFonts(req.query.family);
  } catch (e) {
    res.send("Invalid `family` query param value.");
    return next();
  }
  var css = "";
  var hasError = false;
  fonts.forEach(function(font) {
    if (hasError) return;
    if (!(font.family in availableFonts)) {
      res.send(font.family + " is not an available font family.");
      hasError = true;
      return;
    }
    font.weights.forEach(function(weight) {
      if (availableFonts[font.family].indexOf(weight) === -1) {
        res.send(font.family + " only supports font weights of " + availableFonts[font.family].join(",") + " but got " + weight + ".");
        hasError = true;
        return;
      }
      css += interpolate(fontFaceTemplate, {
        baseUrl: baseUrl,
        fontFamily: font.family,
        fontWeight: weight,
      });
    });
  });

  if (hasError) {
    next();
  }
  else {
    res.send(css);
    next();
  }
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Server listening on port ' + app.get('port'));
});
