//////////////// Library functions
/////// PRNG
// Based on PseudoRandom, by Google. Apache License 2.0
var PseudoRandom = function(opt_seed) {
  this.seed_ = opt_seed ||
               PseudoRandom.seedUniquifier_ + Date.now();
};
PseudoRandom.seedUniquifier_ = 0;
PseudoRandom.A = 48271;
PseudoRandom.M = 2147483647;
PseudoRandom.Q = 44488;
PseudoRandom.R = 3399;
PseudoRandom.ONE_OVER_M = 1.0 / PseudoRandom.M;
PseudoRandom.prototype.random = function() {
  var hi = this.seed_ / PseudoRandom.Q;
  var lo = this.seed_ % PseudoRandom.Q;
  var test = PseudoRandom.A * lo -
             PseudoRandom.R * hi;
             
  if (test > 0) {
    this.seed_ = test;
  } else {
    this.seed_ = test + PseudoRandom.M;
  }
  // % stops foolishness with shoddy RNG overflows
  return (this.seed_ * PseudoRandom.ONE_OVER_M) % 1.0;
};
PseudoRandom.prototype.randint = function(lo, hiplus1) {
  return Math.floor(this.random() * (hiplus1-lo)) + lo;
};
///// CDF wrangling
function cdf(weights) {
  //produce a normalised cdf of distribution weights
  var cdf = new Array;
  var accum = 0;
  var top;
  for (var i=0; i < weights.length; i++) {
    accum = accum + weights[i];
    cdf[i] = accum;
  }
  top = cdf[cdf.length-1];
  if (top<=0) {
    //no weights! to avoid NaNs we return a null, which must be checked for.
    return null;
  } else {
    return cdf.map(function (x) { return x/top ;});
  }
};
function index_cdf(cdf, f) {
  //If my calculations are correct, this is going to give me the index of the
  //first value greater than the lookup.
  var i;
  for (i=0; cdf[i]<f; i++) { };
  return i;
};
function mtof(f) {
  return 440 * Math.exp(0.057762265 * (f - 69));
}
function ftom(m) {
  return 69 + (1/.057762265) * Math.log(m/440);
}
function real_modulo(a, b) {
  //cribbed from google closure library
  var r = a % b;
  // If r and b differ in sign, add b to wrap the result to the correct sign.
  return (r * b < 0) ? r + b : r;
};