var path = require('path');
var FontVariant = require(path.join(global.__base, "lib", "font-variant"));

module.exports = Font;

function Font(family, variantStrings) {
  this.family = family;
  this.variants = (variantStrings || []).map(function(variantString) {
    return new FontVariant(family, variantString);
  });
}

Font.prototype.addVariant = function(variantString) {
  if (!this.hasVariant(variantString)) {
    this.variants.push(new FontVariant(this.family, variantString));
  }
};

Font.prototype.hasVariant = function(variantString) {
  return this.variants.some(function(variant) {
    return variant.variantString === variantString;
  });
};

Font.prototype.asJSON = function() {
  return {
    family: this.family,
    variants: this.variants.map(function(variant) {
      return variant.variantString;
    }),
  };
};
