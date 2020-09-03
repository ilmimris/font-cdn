// Static server for serving up font files.
var express = require('express');
var path = require('path');
var setCorsHeaders = require('./set-cors-headers');

module.exports = express.static('public', {
  dotfiles: 'ignore',
  etag: false,
  index: false,
  maxAge: '30d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    setCorsHeaders(res);
  },
});
