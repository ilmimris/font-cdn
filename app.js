'use strict';

global.__base = __dirname + '/';
var env = process.env.NODE_ENV || 'development';
var baseUrl = process.env.BASE_URL || 'http://localhost:3000';
var express = require('express');
var http = require('http');
var fs = require('fs');
var interpolate = require('interpolate');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var forceSsl = require('express-enforces-ssl');
var path = require('path');
var setCorsHeaders = require(path.join(global.__base, 'lib', 'set-cors-headers'));
var app = express();

app.set('port', process.env.PORT || 3000);

// Disable some default headers set by Express
app.set('etag', false);
app.set('x-powered-by', false);

// Environment-specific configuration
if (env === 'production') {
  app.use(logger('combined'));
  // Force SSL. Note that trust proxy must be set to work behind reverse proxies (Heroku).
  app.enable('trust proxy');
  app.use(forceSsl());
}
else {
  app.use(logger('dev'));
  app.use(errorHandler({dumpExceptions: true, showStack: true}));
}

app.use(require(path.join(global.__base, 'lib', 'static-assets-middleware')));

var fontFaceTemplate = fs.readFileSync(path.join(global.__base, 'css', 'font-face-template.css'), 'utf8');
var availableFonts = require(path.join(global.__base, 'lib', 'available-fonts'))();

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
  setCorsHeaders(res);
  res.set("x-frame-options", "SAMEORIGIN");
  res.set("content-type", "text/css");
  res.set("cache-control", "private, max-age=86400, stale-while-revalidate=604800");

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
  console.log("Available fonts: ", JSON.stringify(availableFonts, null, 2));
});
