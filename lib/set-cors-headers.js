// Sets standard CORS headers on an Express response.
module.exports = function(res) {
  res.set("access-control-allow-origin", "*");
  res.set("timing-allow-origin", "*");
  res.set("x-content-type-options", "nosniff");
  res.set("x-xss-protection", "1; mode=block");
};
