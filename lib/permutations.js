var _ = require('lodash');

module.exports = function permutations(set) {
  var perms = [];
  if (set.length < 2) {
    return set;
  }
  if (set.length === 2) {
    return [set, [set[1], set[0]]];
  }
  permutations(set.slice(0,-1)).forEach(function(perm) {
    var i = 0, k = perm.length, p;
    _.range(perm.length + 1).forEach(function(i) {
      p = _.cloneDeep(perm);
      p.splice(i, 0, set[set.length - 1]);
      perms.push(p);
    });
  });
  return perms;
};
