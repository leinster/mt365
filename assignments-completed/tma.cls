%% http://en.wikipedia.org/wiki/List_of_mathematical_symbols

\ProvidesClass{tma}

\LoadClass{article}

\usepackage{extsizes}
\usepackage[pdfborder={0 0 0}]{hyperref}
\usepackage{fancyhdr}
\setlength{\headheight}{15pt}
\usepackage{lastpage}
\usepackage{array}
\usepackage{longtable}
\usepackage{parskip}
\usepackage[usenames,dvipsnames]{xcolor}
\usepackage{tikz}
\usepackage{tikz-qtree}
\usepackage{siunitx}
\usepackage{calrsfs}           % Ralph Smith's Formal Script Font \mathscr{N}
\usepackage{bm}
\usepackage{caption}
\usepackage{xfrac}
\usepackage{ulem}               % provides \sout for strike-thru

% margins
\usepackage[a4paper]{geometry}

% tikz for flow diagrams, graphs
\usetikzlibrary{shapes,arrows,decorations.markings,positioning,graphs,graphs.standard,graphdrawing,quotes}
\usegdlibrary{circular,trees,layered,force}
\tikzstyle{block} = [rectangle, draw, text centered, minimum width=7em]

% Student, Course & Assignment
\newcommand{\course}[1]{\def \@course {#1}}
\newcommand{\tma}[1]{\def \@tma {#1}}
\newcommand{\tmapart}[1]{\def \@tmapart {#1}}

% Student info
\newcommand{\studentinfo}{
  Jonathon Ramsey~U576294X
}

% Student title
\newcommand{\tmatitle}{
  TMA \@course \space \two@digits{\@tma}
  \ifdefined \@tmapart
    \space - Part \@tmapart
  \fi
}

% Title Page
\date{}                         % don't need a date
\renewcommand{\titlepage}{
    \author{\studentinfo}
    \title{\tmatitle}
    \maketitle
}

% Headers
\pagestyle{fancyplain}
\fancyhf{}
\lhead{\fancyplain{}{\tmatitle}}
\rhead{\fancyplain{}{\studentinfo}}
\cfoot{\fancyplain{}{\thepage\ of \pageref{LastPage}}}

% Question headers
\newenvironment{question}[1]
               {{\textbf{Question #1}}
                 \vskip\smallskipamount}
               {\smallbreak}

\newenvironment{subquestion}[1]
               {(#1)\enspace}
               {\smallbreak}

% m381
\newenvironment{indentedTable}[1]
               {\medskip
                 \hspace\mathindent
                 \begin{tabular}{#1}}
               {\end{tabular}
                 \bigskip}

\newenvironment{flowDiagram}
               {\medskip
                 \hspace\mathindent}
               {\bigskip}

\newenvironment{URM-program}
               {\begin{indentedTable}{rl}}
               {\end{indentedTable}}

\usepackage{mathtools, amssymb}

\newtheorem{theorem}{Theorem}
\newtheorem{lemma}{Lemma}
\newtheorem{proposition}{Proposition}
\newtheorem{conjecture}{Conjecture}

\newcommand{\R}{\ensuremath{\mathbb{R}}}
\newcommand{\C}{\ensuremath{\mathbb{C}}}
\newcommand{\Z}{\ensuremath{\mathbb{Z}}}
\newcommand{\N}{\ensuremath{\mathbb{N}}}
\newcommand{\qed}{\marginpar{$\blacksquare$}}
\newcommand{\lqed}{\marginpar{$\blacklozenge$}}

\newenvironment{proof}
               {\bigskip\noindent\textbf{Proof ~}}
               {\qed\bigskip}

\DeclarePairedDelimiterX\set[2]{\lbrace}{\rbrace}%
 {\, #1 \,\delimsize\colon\, #2 \,}

\DeclareMathOperator{\lcm}{lcm}
\DeclareMathOperator{\add}{add}
\DeclareMathOperator{\mult}{mult}
\DeclareMathOperator{\fac}{fac}
\DeclareMathOperator{\reg}{reg}
\DeclareMathOperator{\pred}{pred}

%% less space before (mod x), http://www.matthewflickinger.com/blog/archives/2005/02/20/latex_mod_spacing.asp
\makeatletter
\def\jmod#1{\allowbreak\mkern7mu({\operator@font mod}\,\,#1)}
\makeatother

%% http://tex.stackexchange.com/questions/43008/absolute-value-symbols
\DeclarePairedDelimiter\abs{\lvert}{\rvert}%
\DeclarePairedDelimiter\norm{\lVert}{\rVert}%

% Swap the definition of \abs* and \norm*, so that \abs
% and \norm resizes the size of the brackets, and the
% starred version does not.
\makeatletter
\let\oldabs\abs
\def\abs{\@ifstar{\oldabs}{\oldabs*}}
%
\let\oldnorm\norm
\def\norm{\@ifstar{\oldnorm}{\oldnorm*}}
\makeatother
