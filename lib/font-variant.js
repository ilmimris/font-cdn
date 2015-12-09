module.exports = FontVariant;

// `variantString` is something like "400italic" or "700".
function FontVariant(family, variantString) {
  this.family = family;
  this.variantString = variantString;
  this.weight = parseWeightFromVariantString(variantString);
  this.style = parseStyleFromVariantString(variantString);
}

FontVariant.prototype.path = function() {
  return '/fonts/' + this.family.replace(/\s/g, "-") + '-' + this.variantString;
};

var parseWeightFromVariantString = function(variantString) {
  return variantString.match(/^[0-9]{3}/)[0];
};

var parseStyleFromVariantString = function(variantString) {
  var styleMatch = variantString.match(/(italic|oblique)$/);
  if (styleMatch) {
    return styleMatch[0];
  }
  else {
    return "normal";
  }
};
