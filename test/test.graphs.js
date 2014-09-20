var assert = require('chai').assert;

var graphs = require('../lib/graphs');
var GraphsException = graphs.GraphsException;

describe("graphs", function() {
  describe("vertices", function() {
    it("should return an empty list for an empty graph", function() {
      assert.deepEqual(graphs.vertices({}), []);
    });

    it("should return a single vertex", function() {
      assert.deepEqual(graphs.vertices({ "A": {} }), ["A"]);
    });

    it("should return multiple vertices", function() {
      assert.deepEqual(graphs.vertices({
        "A": {},
        "B": {}
      }), ["A", "B"]);
    });

    it("should return vertices that only appear as connections", function() {
      assert.deepEqual(graphs.vertices({
        "A": {
          "C": 0
        },
        "B": {}
      }), ["A", "B", "C"]);
    });
  });

  describe("edges", function() {
    it("should return an empty list for an empty route", function() {
      assert.deepEqual(graphs.edges([]), []);
    });

    it("should return an empty list for a single element route", function() {
      assert.deepEqual(graphs.edges(['A']), []);
    });

    it("should return a single pair of vertices", function() {
      assert.deepEqual(graphs.edges(["A", "B"]), [["A", "B"]]);
    });

    it("should return a pair of vertices for each pair in the route", function() {
      assert.deepEqual(graphs.edges(["A", "B", "C"]),
                       [["A", "B"], ["B", "C"]]);

    });
  });

  describe("weight", function() {
    it("should throw if the vertices do not exist", function() {
      assert.throws(function() {
        graphs.weight({}, ["A", "B"]);
      }, GraphsException);
    });

    it("should throw if there is no edge between the vertices", function() {
      assert.throws(function() {
        graphs.weight({ "A": {}, "B": {} }, ["A", "B"]);
      }, GraphsException);
    });

    it("should return the weight of the edge", function() {
      assert.strictEqual(graphs.weight({ "A": { "B": 0 } }, ["A", "B"]), 0);
      assert.equal(graphs.weight({ "B": { "A": 17.5 } }, ["A", "B"]), 17.5);
    });
  });

  describe("distinctRoutes", function() {
    var graph;

    beforeEach(function() {
      graph = {
        "A": {
          "B": 1,
          "C": 5
        },
        "B": {
          "C": 7
        }
      };
    });

    it("should return an empty list for an empty set of vertices", function() {
      assert.deepEqual(graphs.distinctRoutes(graph, []), []);
    });

    it("should return an empty list for a single vertex", function() {
      assert.deepEqual(graphs.distinctRoutes(graph, ["A"]), []);
    });

    it("should return a pair of routes for a pair of vertices", function() {
      assert.deepEqual(graphs.distinctRoutes(graph, ["A", "B"]),
                       [["A", "B"], ["B", "A"]]);
    });

    it("should return n! routes for n vertices", function() {
      assert.deepEqual(graphs.distinctRoutes(graph, ["A", "B", "C"]),
                       [["A", "B", "C"], ["A", "C", "B"],
                        ["B", "A", "C"], ["B", "C", "A"],
                        ["C", "A", "B"], ["C", "B", "A"]]);
    });

    it("should throw if a vertex does not appear in the graph", function() {
      assert.throws(function() {
        graphs.distinctRoutes(graph, ["A", "D"]);
      }, GraphsException);
    });
  });

  describe("routeWeight", function() {
    var graph;

    beforeEach(function() {
      graph = {
        "A": {
          "B": 1,
          "C": 5
        },
        "B": {
          "C": 7
        }
      };
    });

    it("should return zero for an empty route", function() {
      assert.strictEqual(0, graphs.routeWeight(graph, []));
    });

    it("should return zero for a single element route", function() {
      assert.strictEqual(0, graphs.routeWeight(graph, ["A"]));
    });

    it("should return the total weight for a two-element route", function() {
      assert.equal(graphs.routeWeight(graph, ["A", "C"]), 5);
    });

    it("should return the total weight for a three-element route", function() {
      assert.equal(graphs.routeWeight(graph, ["A", "C", "B"]), 12);
    });
  });
});
