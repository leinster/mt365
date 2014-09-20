#!/usr/bin/env node

// Builds a network for use with the course software Netflow.exe program from a
// JSON representation.
var path = require('path');

var _ = require('lodash');
var sprintf = require('sprintf').sprintf;

if (process.argv.length !== 3) {
  console.warn("Usage: " + path.basename(process.argv[1]) + " network.json");
  process.exit(1);
}

function cVertex(vertex) {
  return sprintf("cVertex(oWP(%0.2f,%0.2f),0,oBrush(oColour(0,255,255),0,4),\"%s\")",
                 vertex[1][0],
                 vertex[1][1],
                 vertex[0]);
}

function cArc(network, start, end, flow, capacity) {
  var startPos = network[start].pos;
  var endPos = network[end].pos;
  var vector = [endPos[0] - startPos[0], endPos[1] - startPos[1]];
  return sprintf("cCapArc(cArc(cEdge(oWP(%0.2f,%0.2f)," +
                 "oWV(%0.2f,%0.2f),0,0,oPen(oColour(0,0,0),1,0),\"\")),0,%d,%d)",
                 startPos[0], startPos[1],
                 vector[0], vector[1],
                 flow,
                 capacity);
  return vector;
}

function connection(network, a, b) {
  if (network[a].arcs[b]) return 1;
  if (network[b].arcs[a]) return -1;
  return 0;
}

var network = require(path.resolve(process.argv[2]));
var vertexLabels = _.keys(network);
var vertices = [];
var arcs = [];
var cVertices = [];
var cArcs = [];
var connections = [];

_.each(network, function(data, label) {
  vertices.push([label, data.pos]);
  _.each(data.arcs, function(capacity, endLabel) {
    arcs.push([label, endLabel, capacity]);
  });
});

_.each(vertices, function(vertex) {
  cVertices.push(cVertex(vertex));
  connections.push("(" + _.map(arcs, function(arc) {
    if (arc[0] === vertex[0]) return 1;
    if (arc[1] === vertex[0]) return -1;
    return 0;
  }).join(",") + ")");
});
_.each(arcs, function(arc) {
  cArcs.push(cArc(network, arc[0], arc[1], arc[2][0], arc[2][1]));
});

console.log("cNetwork(cDiGraph(cGraph(\n" +
            "(\n%s\n),\n" +
            "(\n%s\n),\n" +
            "(\n%s\n)\n" +
            ")))",
           cVertices.join(",\n"),
           cArcs.join(",\n"),
           connections.join(",\n"));
