var _ = require('lodash');
var sprintf = require('sprintf');

var permutations = require('./permutations');

var GraphsException = exports.GraphsException = function GraphsException(message) {
  this.message = message;
  this.name = "GraphsException";
};

var vertices = exports.vertices = function vertices(graph) {
  return _.uniq(_.reduce(graph, function(acc, connected, vertex) {
    acc.push(vertex);
    return acc.concat(_.keys(connected));
  }, [])).sort();
};

var edges = exports.edges = function edges(route) {
  return _.reduce(route, function(acc, vertex, i) {
    if (i < (route.length - 1)) {
      acc.push([vertex, route[i + 1]]);
    }
    return acc;
  }, []);
};

var edgeExists = function edgeExists(graph, edge) {
  function exists(a, b) {
    return graph[a] && ! _.isUndefined(graph[a][b]);
  }
  return (exists(edge[0], edge[1]) || exists(edge[1], edge[0]));
};

var weight = exports.weight = function weight(graph, edge) {
  if (! edgeExists(graph, edge)) {
    throw new GraphsException(sprintf("There is no edge from %s to %s",
                                     edge[0], edge[1]));
  }
  if (graph[edge[0]] && ! _.isUndefined(graph[edge[0]][edge[1]])) {
    return graph[edge[0]][edge[1]];
  }
  return graph[edge[1]][edge[0]];
};

var routeExists = exports.routeExists = function routeExists(graph, route) {
  return _.every(edges(route), function(edge) {
    return edgeExists(graph, edge);
  });
};

var distinctRoutes = exports.distinctRoutes = function distinctRoutes(graph, routeVertices) {
  var message;
  var allVertices = vertices(graph);
  var verticesExist = _.every(routeVertices, function(vertex) {
    return _.contains(allVertices, vertex);
  });
  if (! verticesExist) {
    message = sprintf("One or more of the vertices %s does not appear in the graph %s!",
                      routeVertices.join(", "), allVertices.join(", "));
    throw new GraphsException(message);
  }
  return _.compact(_.map(permutations(routeVertices), function(route) {
    return (route.length > 1 && routeExists(graph, route)) && route;
  })).sort();
};

var routeWeight = exports.routeWeight = function routeWeight(graph, routeVertices) {
  return _.reduce(edges(routeVertices), function(acc, edge) {
    return acc + weight(graph, edge);
  }, 0);
};
