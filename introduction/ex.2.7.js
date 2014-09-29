#!/usr/bin/env node
var _ = require('lodash');

var permutations = require('../lib/permutations');

console.log(_.map(permutations(["A", "B", "C", "D"]), function(permutation) {
  return permutation.join("");
}).sort().join("\n"));
