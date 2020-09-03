var path = require("path");
var Font = require(path.join(global.__base, "lib", "font"));

module.exports = FontQueryStringParser;

// Parses a query string like `Montserrat:400,700|Futura:100` into font families
// and weights.
function FontQueryStringParser(query) {
  this.query = query;
  this.isParseable = true;
  try {
    this.fonts = query.split("|").map(function(familyQuery) {
      var family = familyQuery.split(":")[0];
      var variants = familyQuery.split(":")[1].split(",");
      return new Font(family, variants);
    });
  }
  catch(e) {
    this.isParseable = false;
  }
}

FontQueryStringParser.prototype.isQueryValid = function() {
  return this.isParseable && !this.query.match(/^\s*$/);
};

FontQueryStringParser.prototype.queryValidationErrors = function() {
  // TODO: Consider returning a more specific message
  return "Invalid `family` query param.";
}

FontQueryStringParser.prototype.areFamiliesValid = function() {
  return !this.familyValidationErrors();
};

FontQueryStringParser.prototype.areVariantsValid = function() {
  return !this.variantValidationErrors();
};

FontQueryStringParser.prototype.familyValidationErrors = function() {
  var invalidFamilies = [];
  this.fonts.forEach(function(font) {
    if(!global.fonts.isFamilyAvailable(font.family)) {
      invalidFamilies.push(font.family);
    }
  });

  if (invalidFamilies.length > 0) {
    return invalidFamilies.map(function(family) {
      return family + " is not an available font family.";
    }).join("\n");
  }
};

FontQueryStringParser.prototype.variantValidationErrors = function() {
  var invalidVariants = [];

  this.fonts.forEach(function(font) {
    font.variants.forEach(function(variant) {
      if (!global.fonts.isVariantAvailable(font.family, variant.variantString)) {
        invalidVariants.push({family: font.family, variant: variant});
      }
    });
  });

  if (invalidVariants.length > 0) {
    return invalidVariants.map(function(font) {
      return font.family + " only supports variants: " + global.fonts.availableVariantStrings(font.family).join(",");
    }).join("\n");
  }
};
