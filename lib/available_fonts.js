// Check /public/fonts/ for a list of available font families and font weights.
var glob = require("glob");

module.exports = function() {
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
  return availableFonts;
};
