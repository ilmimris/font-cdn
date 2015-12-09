// Check /public/fonts/ for a list of available font families and font weights.
var glob = require("glob");

module.exports = AvailableFonts;

function AvailableFonts() {
  var _this = this;
  _this.fonts = {};

  glob.sync("./public/fonts/*.@(woff|woff2)").forEach(function(fontPath) {
    var filename = fontPath.replace("./public/fonts/", "").replace(/\.woff2?$/, "");
    var family = filename.split("-")[0];
    var weight = filename.split("-")[1];
    _this.fonts[family] = _this.fonts[family] || [];
    if (_this.fonts[family].indexOf(weight) === -1) {
      _this.fonts[family].push(weight);
    }
  });
}

AvailableFonts.prototype.isFamilyAvailable = function(fontFamily) {
  return fontFamily in this.fonts;
};

AvailableFonts.prototype.isWeightAvailable = function(fontFamily, fontWeight) {
  fontWeight = fontWeight.toString();
  return this.isFamilyAvailable(fontFamily) && this.fonts[fontFamily].indexOf(fontWeight) !== -1;
};

AvailableFonts.prototype.weightsFor = function(fontFamily) {
  return this.fonts[fontFamily];
};

AvailableFonts.prototype.asJSON = function() {
  return this.fonts;
};
