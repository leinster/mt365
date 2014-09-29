# Drawing graphs

## TikZ in LaTeX

Using `graph`, `graphdrawing` TikZ packages. Requires use of `lualatex` rather then `pdflatex`.

Must specify the graph layout engine you want to use for automatic layout. Lots of options. The layout engine must be made available with a call to `\usegdlibrary` in the document prefix. Library options are:

  - trees
  - layered
  - force
  - circular
  - phylogenetics
  - ogdf

`circular` provides the simple necklace layout.

    % for the document prefix
    \usepackage{tikz}
    \usetikzlibrary{snakes,arrows,shapes,graphs,graphdrawing,positioning}
    \usegdlibrary{trees, layered, force, circular}

    % manually positioned nodes
    \begin{tikzpicture}[
        point/.style={draw,circle,inner sep=1.5pt,fill=black}
      ]
      \node (i) at (0, 0) [point,label=$i$]{};
      \node (j) at (-1, 0.3) [point,label=$j$]{};
      \node (h) at (1, 0.3) [point,label=$h$]{};
      \node (a) at (-1, 1.3) [point,label=$a$]{};
      \node (b) at (1, 1.3) [point,label=$b$]{};
      \node (f) at (-2, -0.3) [point,label=$f$]{};
      \node (c) at (2, -0.3) [point,label=$c$]{};
      \node (e) at (-1, -1) [point,label=$e$]{};
      \node (d) at (1, -1) [point,label=$d$]{};
      \node (g) at (0, -0.6) [point,label=$g$]{};
      \graph [use existing nodes] {
        e -- f -- a -- h -- i -- j -- b -- c -- d -- e;
        a -- b;
        e -- j;
        d -- h;
        f -- g -- c;
      };
    \end{tikzpicture}

    \begin{tikzpicture}[
        simple necklace layout,
        node distance=2cm,
        point/.style={circle,inner sep=1.5pt,fill=black},
        pointWhite/.style={point,fill=white,draw=black!80}
      ]
      \node (a) [point,label=$a$] {};
      \node (b) [pointWhite,label=$b$] {};
      \node (c) [point,label={[below left=5mm and 2mm of c]$c$}] {};
      \node (d) [pointWhite,label={[below right=5mm and 2mm of d]$d$}] {};
      \node (e) [point,label=$e$] {};
      \graph [use existing nodes] {
        a -- b -- c -- d -- e -- a -- c -- e -- b -- d -- a;
      };
    \end{tikzpicture}


    \tikz \graph [spring layout, vertical=1 to 2] { 1--2--3--1 };

    \tikz \graph [simple necklace layout] {
      a -- b -- c -- d -- e -- f -- a
    };

    \begin{tikzpicture}[rounded corners]
      \node (a) [draw,circle,fill=black,label=$a$] {};
      \graph [layered layout, sibling distance=8mm, level distance=8mm]
             {
               a -> {
                 b,
                 c -> { d, e }
               } ->
               f ->
               a
             };
    \end{tikzpicture}

## NetworkX/Graphviz

Using [NetworkX](http://networkx.github.io/) for building the graphs and [Graphviz](http://www.graphviz.org/) with [PyGraphviz](http://pygraphviz.github.io/) for rendering.

    $ brew install graphviz
    $ brew install python
    $ pip install --upgrade setuptools
    $ pip install --upgrade pip
    $ pip install networkx
    $ pip install pygraphviz

Initially tried to use [matplotlib](http://matplotlib.org/), but couldn't get the install to succeed (tried `brew`, `pip`, and download of OS X binary).

[JSNetworkX](http://felix-kling.de/JSNetworkX/) could be worth having a look at.

### Usage

In python:

    >>> import networkx as nx
    >>> import pygraphviz as pgv
    >>> G = nx.Graph()
    >>> G.add_node(1)
    >>> G.add_nodes_from([2,3])
    >>> G.add_edge(1, 2)
    >>> G.add_edge(*(2,3)) # unpack edge tuple
    >>> G.add_edges_from([(1,3)])

Convert to pygraphviz object:

    >>> A = nx.to_agraph(G)
    >>> print(A.string()) # prints dot format to screen

Write dot format out to a file:

    >>> A.write('simple.dot') # writes dot format

For output with small dots for nodes:

    >>> A.node_attr.update(shape="point")

To add labels to nodes:

    >>> A.get_node(1).attr.update(xlabel='a')
    >>> A.get_node(2).attr.update(xlabel='b')
    >>> A.get_node(3).attr.update(xlabel='c')

To set node color to white:

    >>> A.get_node(3).attr.update(fillcolor='white')

Generate positioning data (do this *after* setting node attributes):

    >>> A.layout() # layout with default (neato)
    >>> A.layout(prog='twopi')
    >>> A.layout(prog='circo')

Write out files:

    >>> A.draw('simple.png')
    >>> A.draw('simple.pdf')

Node labels can end up in odd positions, after checking the output modify the node's xlp attr, then draw again to check position. Coordinates are x left-to-right, y bottom-to-top.

    >>> A.get_node(4).attr["xlp"] = "125,2"
    >>> A.draw('simple.png')

This all works, but doesn't produce the nicest output.

When including graphics in latex, `angle` option to `\includegraphics` may be useful:

    angle=xx	This option can rotate the image by xx degrees (counter-clockwise)

#### [dot2tex](https://github.com/kjellmf/dot2tex/)

[Documentation](http://dot2tex.readthedocs.org/en/latest).

Provides `dot2tex` script that takes (plain - i.e. no layout) dot file input and can produce tikz output for LaTeX.

    $ pip install dot2tex
    $ tlmgr install preview

    $ dot2tex -ftikz -tmath --straightedges --prog=twopi K4.dot > K4.tex
    $ pdflatex K4.tex

Standalone figure for inclusion in another LaTeX document:

    $ dot2tex --figonly -ftikz -tmath --straightedges --prog=twopi K4.dot > K4.tex

Output needs manual modification, but will have much more control over e.g. label placement etc.

### Using graphviz dot

    $ dot -Tpng K4.dot -o K4.png -Kneato
    $ dot -Tpdf K4.dot -o K4.pdf -Kneato

`-T` specifies output type.
`-K` specifies layout engine, use one of: circo dot fdp neato nop nop1 nop2 osage patchwork sfdp twopi.

Can use different program directly rather than specifying layout engine, e.g.

    $ circo -Tpdf K4.dot -o K4.pdf

twopi, circo, osage, neato (default) seem like the best options.
