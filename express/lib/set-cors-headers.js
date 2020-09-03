module.exports = function(res) {
  // Allows cross-origin HTTP requests.
  res.set("access-control-allow-origin", "*");

  // Allows JavaScript to measure the performance on this cross-origin request.
  res.set("timing-allow-origin", "*");

  // Prevents browser from MIME-sniffing a response away from the declared content-type.
  res.set("x-content-type-options", "nosniff");

  // Enables the Cross-site scripting (XSS) filter built into browsers.
  res.set("x-xss-protection", "1; mode=block");
};
