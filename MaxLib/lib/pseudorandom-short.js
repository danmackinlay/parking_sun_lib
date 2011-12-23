// Based on PseudoRandom, by Google. Apache License 2.0
PseudoRandom = function(opt_seed) {
  this.seed_ = opt_seed ||
               PseudoRandom.seedUniquifier_;
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
  return this.seed_ * PseudoRandom.ONE_OVER_M;
};
