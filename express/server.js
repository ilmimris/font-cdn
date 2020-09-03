'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

const AvailableFonts = require(path.join(__dirname, '../public/lib/available-fonts.js'));
global.fonts = new AvailableFonts();

const FontQueryStringParser = require(path.join(__dirname, '../public/lib/font-query-string-parser.js'));
const setCorsHeaders = require(path.join(__dirname, '../public/lib/set-cors-headers.js'));
const fontFaceTemplate = fs.readFileSync((path.join(__dirname, '../public/css/font-face-template.css')), 'utf8');


const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.set('etag', false);
app.set('x-powered-by', false);
app.use(require(path.join(__dirname, '../public/lib/static-assets-middleware.js')));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

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
  if (!parser.areVariantsValid()) {
    res.send(parser.variantValidationErrors());
    return next();
  }

  var css = "";
  parser.fonts.forEach(function(font) {
    font.variants.forEach(function(variant) {
      css += interpolate(fontFaceTemplate, {
        fontFamily: variant.family,
        fontUrl: baseUrl + variant.path(),
        fontWeight: variant.weight,
        fontStyle: variant.style,
      });
    });
  });

  res.send(css);
});
module.exports = app;
module.exports.handler = serverless(app);
