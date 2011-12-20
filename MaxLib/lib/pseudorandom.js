// Based on PseudoRandom, by Google. Apache License 2.0

/**
 * @fileoverview PseudoRandom provides a mechanism for generating deterministic
 * psuedo random numbers based on a seed. Based on the Park-Miller algorithm.
 * See http://www.cit.gu.edu.au/~anthony/info/C/RandomNumbers and
 * http://www.erikoest.dk/rng.htm.
 *
 */

/**
 * Class that generates deterministic random numbers.
 *
 * @param {number=} opt_seed The seed to use.
 * @param {boolean=} opt_install Whether to install the PseudoRandom at
 *     construction time.
 * @extends {goog.Disposable}
 * @constructor
 */
PseudoRandom = function(opt_seed) {

  /**
   * The sequence of numbers to be returned by calls to random()
   * @type {number}
   * @private
   */
  this.seed_ = opt_seed ||
               PseudoRandom.seedUniquifier_;
};


/**
 * Helps create a unique seed.
 * @type {number}
 * @private
 */
PseudoRandom.seedUniquifier_ = 0;


/**
 * Constant used as part of the algorithm.
 * @type {number}
 */
PseudoRandom.A = 48271;


/**
 * Constant used as part of the algorithm. 2^31 - 1.
 * @type {number}
 */
PseudoRandom.M = 2147483647;


/**
 * Constant used as part of the algorithm. It is equal to M / A.
 * @type {number}
 */
PseudoRandom.Q = 44488;


/**
 * Constant used as part of the algorithm. It is equal to M % A.
 * @type {number}
 */
PseudoRandom.R = 3399;


/**
 * Constant used as part of the algorithm to get values between 0 and 1.
 * @type {number}
 */
PseudoRandom.ONE_OVER_M = 1.0 / PseudoRandom.M;


/**
 * @return {number} The next number in the sequence.
 */
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
