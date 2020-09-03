// Check /public/fonts/ for a list of available font families and font weights.
var glob = require("glob");
var path = require("path");
var Font = require(path.join(global.__base, "lib", "font"));

module.exports = AvailableFonts;

function AvailableFonts() {
  var _this = this;
  // key = family, value = Font instance
  this.fontsLookup = {};
  this.fonts = [];

  glob.sync("./public/fonts/*.@(woff|woff2)").forEach(function(fontPath) {
    var filename = fontPath.replace("./public/fonts/", "").replace(/\.woff2?$/, "");
    var family = filename.split("-").slice(0, -1).join(" ");
    var variantString = filename.split("-").slice(-1)[0];
    if (!(_this.fontsLookup[family])) {
      var font = new Font(family);
      _this.fontsLookup[family] = font;
      _this.fonts.push(font);
    }
    _this.fontsLookup[family].addVariant(variantString);
  });
}

AvailableFonts.prototype.isFamilyAvailable = function(family) {
  return family in this.fontsLookup;
};

AvailableFonts.prototype.isVariantAvailable = function(family, variant) {
  return this.isFamilyAvailable(family) && this.fontsLookup[family].hasVariant(variant);
};

AvailableFonts.prototype.availableVariantStrings = function(family) {
  return this.fontsLookup[family].variants.map(function(variant) {
    return variant.variantString;
  });
};

AvailableFonts.prototype.asJSON = function() {
  return this.fonts.map(function(font) {
    return font.asJSON();
  });
};
