js
==

Javascript stuff

list_interserction.js : Find the intersection of N ordered lists of M integer elements

dice.js : Generate dice total frequency table using a naive permutation approach and one using linear memory

bloom_filter : Bloom filter in Javascript using a character backed array as bitset (since ints don't exist) and custom hashing function generation for string hashing.

binarySearch : Implemented a binary search for numbers to find out what the many subtle bugs are. Uses an iterative span+midpoint approach and not the usual recursive with Left and Right indices one.

mergeSort : Implemented mergesort to find out all the ways that can go wrong.

fibonacci : Function that computes fibonacci(n) in sublinear time

BinaryTree : A binary tree class that supports balancing, intersection and comparison (both values and structure)
         Also: implementation of the Day-Stout-Warren algorithm for balancing the tree
         Run: jsc -e 'load("BinaryTree.js"); var t = treeFromList( shuffle( range(1,8)) ); t = t.balance_DSW(true);' | dot -Tpng -otree_balancing_DWS.png
         On the command line to get a nice graph of all the steps of the algorithm if you have GraphViz installed

wordhopping.js : From a colleague's interview question: Given a dictionary of words, find the longest chain of words a[0] .. a[n] for which the edit distance between a[i], a[i+] is 1.
