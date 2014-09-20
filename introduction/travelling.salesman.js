#!/usr/bin/env node

// An *exhaustive* travelling salesman problem implementation.
//
// The object representing the graph need only include edges in one direction
// i.e. if the weight on the edge between vertex A to vertex B has already been
// defined then there is no need to define the edge from B to A. See the
// examples p1.10.a.json, p1.10.b.json.
//
var fs = require('fs');
var path = require('path');

var _ = require('lodash');

var graphs = require('../lib/graphs');
var permutations = require('../lib/permutations');

function routes(graph, start) {
  var otherVertices = _.without(graphs.vertices(graph), start);
  return _.reduce(graphs.distinctRoutes(graph, otherVertices), function(acc, route) {
    route = [start].concat(route).concat(start);
    acc.push([route, graphs.routeWeight(graph, route)]);
    return acc;
  }, []).sort(function(a, b) {
    return a[1] - b[1];
  });
}

if (process.argv.length !== 4) {
  console.warn("Usage: %s graph.json start-vertex",
               path.basename(process.argv[1]));
  console.warn("Where graph.json describes the weights on the edges between " +
               "vertices, e.g.");
  console.warn("");
  console.warn('  { "A": { "B": 2, "C": 5 }, "B": { "C": 9 } }');
  process.exit(1);
}

var graph = JSON.parse(fs.readFileSync(path.resolve(process.argv[2])));
_.each(routes(graph, process.argv[3]), function(route) {
  console.log("%s: %d", route[0].join('-'), route[1]);
});
