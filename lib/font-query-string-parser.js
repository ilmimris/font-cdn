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
      var weights = familyQuery.split(":")[1].split(",");
      return new Font(family, weights);
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

FontQueryStringParser.prototype.areWeightsValid = function() {
  return !this.weightValidationErrors();
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

FontQueryStringParser.prototype.weightValidationErrors = function() {
  var invalidFamilyWeights = [];

  this.fonts.forEach(function(font) {
    font.weights.forEach(function(weight) {
      if (!global.fonts.isWeightAvailable(font.family, weight)) {
        invalidFamilyWeights.push({family: font.family, weight: weight});
      }
    });
  });

  if (invalidFamilyWeights.length > 0) {
    return invalidFamilyWeights.map(function(familyWeight) {
      return familyWeight.family + " only supports font weights of " + global.fonts.availableWeights(familyWeight.family).join(",") + " but got " + familyWeight.weight + ".";
    }).join("\n");
  }
};
