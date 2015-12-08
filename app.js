'use strict';

var env = process.env.NODE_ENV || 'development';
var express = require('express');
var http = require('http');
var app = express();

app.set('port', process.env.PORT || 3000);
app.disable('x-powered-by');

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

http.createServer(app).listen(app.get('port'), function() {
  console.log('Server listening on port ' + app.get('port'));
});
