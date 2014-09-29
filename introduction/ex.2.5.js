#!/usr/bin/env node
var path = require('path');
var _ = require('lodash');

if (! process.argv[2]) {
  console.warn("Usage: %s n", path.basename(process.argv[1]));
  console.warn("n ∈ ℕ.");
  process.exit(0);
}

// Straight from http://en.wikipedia.org/wiki/Gray_code
function grayCode(n) {
  var prev;
  var reversed;
  if (n === 1) {
    return ["0", "1"];
  } else {
    prev = grayCode(n - 1);
    reversed = _.cloneDeep(prev).reverse();
    return _.map(prev, function(bitstring) {
      return "0" + bitstring;
    }).concat(_.map(reversed, function(bitstring) {
      return "1" + bitstring;
    }));
  }
}

console.log(grayCode(process.argv[2]).join("\n"));
