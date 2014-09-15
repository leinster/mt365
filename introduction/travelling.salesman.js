#!/usr/bin/env node

// An *exhaustive* travelling salesman problem implementation.
//
// The map of distances between vertices need only include connections in one
// direction i.e. if the distance from vertex A to vertex B has already been
// defined then there is no need to define the distance from B to A. See the
// examples p1.10.a.json, p1.10.b.json.
//
var fs = require('fs');
var path = require('path');

var _ = require('lodash');

var permutations = require('../lib/permutations');

function distance(map, start, end) {
  if (! _.isUndefined(map[start]) &&
      ! _.isUndefined(map[start][end])) {
    return map[start][end];
  }
  return map[end][start];
}

function vertices(map) {
  return _.uniq(_.reduce(map, function(acc, connected, vertex) {
    acc.push(vertex);
    acc = acc.concat(_.keys(connected));
    return acc;
  }, []));
}

function distinctRoutes(map, start) {
  var connections = _.without(vertices(map), start);
  return _.map(permutations(connections), function(permutation) {
    return [start].concat(permutation).concat([start]);
  });
}

function totalDistance(map, route) {
  return _.reduce(route, function(acc, vertex, i) {
    if (i < route.length - 1) {
      acc += distance(map, vertex, route[i + 1]);
    }
    return acc;
  }, 0);
}

function routes(map, start) {
  return _.reduce(distinctRoutes(map, start), function(acc, route) {
    acc.push([route, totalDistance(map, route)]);
    return acc;
  }, []);
}

if (process.argv.length !== 4) {
  console.warn("Usage: %s map.json start-vertex",
               path.basename(process.argv[1]));
  console.warn("Where map.json defines the distances between vertices, e.g.");
  console.warn("");
  console.warn('  { "A": { "B": 2, "C": 5 }, "B": { "C": 9 } }');
  process.exit(1);
}

var map = JSON.parse(fs.readFileSync(path.resolve(process.argv[2])));
var sortedRoutes = routes(map, process.argv[3]).sort(function(a, b) {
  return a[1] - b[1];
});
_.each(sortedRoutes, function(route) {
  console.log("%s: %d", route[0].join('-'), route[1]);
});
