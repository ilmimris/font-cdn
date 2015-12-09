module.exports = Font;

function Font(family, weights) {
  this.family = family;
  this.weights = weights || [];
}

Font.prototype.addWeight = function(weight) {
  weight = weight.toString();
  if (!this.hasWeight(weight)) {
    this.weights.push(weight);
  }
};

Font.prototype.hasWeight = function(weight) {
  weight = weight.toString();
  return this.weights.indexOf(weight) !== -1;
};
