'use strict';

var path = require('path');

var env = process.env.NODE_ENV || 'development';
var baseUrl = process.env.BASE_URL || 'http://localhost:3000';
global.__base = __dirname + '/';
var AvailableFonts = require(path.join(global.__base, 'lib', 'available-fonts'));
global.fonts = new AvailableFonts();

var express = require('express');
var http = require('http');
var fs = require('fs');
var interpolate = require('interpolate');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var forceSsl = require('express-enforces-ssl');

var FontQueryStringParser = require(path.join(global.__base, 'lib', 'font-query-string-parser'));
var setCorsHeaders = require(path.join(global.__base, 'lib', 'set-cors-headers'));
var fontFaceTemplate = fs.readFileSync(path.join(global.__base, 'css', 'font-face-template.css'), 'utf8');

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

app.get("/css", function(req, res, next) {
  setCorsHeaders(res);
  res.set("x-frame-options", "SAMEORIGIN");
  res.set("content-type", "text/css");
  res.set("cache-control", "private, max-age=86400, stale-while-revalidate=604800");

  var parser = new FontQueryStringParser(req.query.family);
  if (!parser.isQueryValid()) {
    res.send(parser.queryValidationErrors());
    return next();
  }
  if (!parser.areFamiliesValid()) {
    res.send(parser.familyValidationErrors());
    return next();
  }
  if (!parser.areWeightsValid()) {
    res.send(parser.weightValidationErrors());
    return next();
  }

  var css = "";
  parser.fonts.forEach(function(font) {
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
  console.log("Available fonts: ", JSON.stringify(global.fonts.asJSON(), null, 2));
});
