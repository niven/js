// jsc load for range() and shuffle()
load('utils.js');

function BinaryTree(val) {
    this.val = val;
}

// insert creates subtrees so we don't need to have null leaf pointers taking up space
BinaryTree.prototype.insert = function( n ) {

    var current = this;
    var direction;
    while( current.val != undefined ) {
        direction = n > current.val ? "right" : "left";
        if( current[direction] == undefined ) {
            current[direction] = new BinaryTree(n);
            return;
        }
        current = current[direction];
    }
    
}

// Remove an item from the tree, in a dirty way
BinaryTree.prototype.remove = function( n ) {
    
    var goner = this.find(n);
    if( goner == undefined ) {
        return false;
    }

    // these are the values of the subtrees that we re-insert
    var moved = [];
    if( goner.right != undefined ) {
        moved = moved.concat( goner.right.values() );
    }
    if( goner.left != undefined ) {
        moved = moved.concat( goner.left.values() );
    }

    
    // special case: if you remove the root, our hack with this.__last_find_parent doesn't work
    if( this.val == n ) {
        this.clear();
        this.val = moved.pop();
    } else {
        // delete the item
        if( this.__last_find_parent.left != undefined && this.__last_find_parent.left.val == n ) {
            delete this.__last_find_parent.left;
        } else {
            delete this.__last_find_parent.right;
        }
    }

    // reattach the left/right subtrees if there are any
    moved.forEach( function(n) { this.insert(n) }, this);
    
    return true;
}

// returns the (sub)BinaryTree that holds the value n
BinaryTree.prototype.find = function( n ) {
    
    this.__last_find_parent = undefined; // awful hack to make delete easier to write
    var current = this;
    while( current != undefined && current.val != n ) {        
        this.__last_find_parent = current;
        current = n > current.val ? current.right : current.left;
    }
    
    return current;
}

// remove everything from this tree
BinaryTree.prototype.clear = function() {

    delete this.val;
    delete this.left;
    delete this.right;
    
}

// return the values in ascending order
BinaryTree.prototype.values = function() {
    
    var out = [];

    if( this.left != null ) {
        out = out.concat( this.left.values() );
    }
    
    out.push( this.val );

    if( this.right != null ) {
        out = out.concat( this.right.values() );
    }
    
    return out;
}

// same as threading the tree ascending.
// worst case scenario: tree has N nodes that are only "lefts" as in inserting 5,4,3,2,1
// then we save N elements in our stack.
// however: we don't use null leaf nodes so where we would have 2N pointers in a threaded tree,
// we only have N, but use N stack for iterating like this so we conserve more memory on average
// (although iterating is computationally much worse)
BinaryTree.prototype.iterator = function() {
    
    function Iterator(start) {
        this.parentStack = [];
        this.current = start;
        
        // start at deepest left leaf (lowest number)
        while( this.current.left != null ) {
            this.parentStack.push( this.current );
            this.current = this.current.left;
        }
        
    }

    Iterator.prototype.value = function() {
        return this.current.val;
    }
    
    Iterator.prototype.next = function() {

        // go up a node if we've done the left and there is no right
        if( this.current.right == null ) {
            this.current = this.parentStack.pop();
        } else {
            // descend as far as we can into the left of the right node
            this.current = this.current.right;
            while( this.current.left != null ) {
                this.parentStack.push( this.current );
                this.current = this.current.left;
            }
        }

    }
    
    Iterator.prototype.hasNext = function() {
        return this.current != undefined;
    }

    return new Iterator( this );
}

// balance the tree using reverse mergesort
BinaryTree.prototype.balance = function() {
    
    // now sort the numbers in such a way that inserting them in order will result in
    // a balanced tree. This is basically reverse-mergesorting :)
    // (of course this not a very fast or cache friendly way to balance a tree)
    
    // 1 -> 1
    // 1,2,3 -> 2,1,3 or 2,3,1
    // 1,2,3,4,5,6,7 -> 4, (2, (1,3) ), (6, (5,7) )
    
    // algorithm: take a list. put the middle item in the front of a new list, then concat the left and right slices using the same appraoch

    function demerge( n ) {
        
        var out = [];
        
        var middle = Math.floor( n.length/2 ); // floor so 1 item won't break
    //    print("n: " + n + " middle: " + middle + " = " + n[middle] );
        out.push( n[middle] );
        // termination if nothing left
        if( middle > 0 ) {
            out = out.concat( demerge( n.slice(0, middle) ) );
        }
        if( middle+1 < n.length ) {
            out = out.concat( demerge( n.slice(middle+1, n.length) ) );
        }     
        return out;
    }
    
    
    var demerged = demerge( this.values() );

    // rebuild the tree
    this.clear();
    this.val = demerged.shift();
    demerged.forEach( function(n) {
        this.insert(n);
    }, this);    
}

/*
    Balance the tree using the Day-Stout_Warren algorithm.
    
    If dotdump is true it outputs a string you can run dot on to make a
    graph so you can see what is going on at every step.
    
*/
BinaryTree.prototype.balance_DSW = function(dotdump) {
    
    var dot = "";
    var dot_generation = 0;
    if( dotdump ) { // tree in current state
        dot += this._dot_dump("g" + dot_generation++ + "_");
    }
    
    // tree to vine
    
    var root = { val: "initial", right: this }; // dummy initial node
    var vine_tail = root;
    var remainder = vine_tail.right;
    var size = 0;
    var temp;

    while( remainder != undefined ) {
        if( remainder.left == undefined ) {
            // move vine_tail down one
            vine_tail = remainder;
            remainder = remainder.right;
            size++;
        } else { // rotate
            temp = remainder.left;
            remainder.left = temp.right;
            temp.right = remainder;
            remainder = temp;
            vine_tail.right = temp;
            if( dotdump ) { // only output here, there is no change if we just move the vine_tail
                dot += root.right._dot_dump("g" + dot_generation++ + "_");
            }
        }
    }
    
    
    // vine to tree
    // convert the vine with "size" nodes and pseudo-root node root into a balanced tree
    var leaf_count;
    
    var compression = function(root, count) {
        var scanner, child;
        
        scanner = root;
        for(var i=1; i<count; i++) {
            child = scanner.right;
            scanner.right = child.right; 
            scanner = scanner.right; 
            child.right = scanner.left; 
            scanner.left = child;
        }
    };
    
    leaf_count = size - Math.floor(Math.pow(2, Math.log(size+1))); 
    compression(root, leaf_count); // create deepest leaves
    if( dotdump ) {
        dot += root.right._dot_dump("g" + dot_generation++ + "_");
    }
    
    size -= leaf_count; // we already did these
    
    while( size > 1 ) {
        size = Math.ceil( size/2 );
        compression(root, size);
        if( dotdump ) {
            dot += root.right._dot_dump("g" + dot_generation++ + "_");
        }
    }
    
    if( dotdump ) {
        print("digraph {\n" + dot + "\n}");
    }
    
    return root.right;
}

// internal function to output a dot string for vizualising
// this outputs a dot without the enclosing "digraph {}" to you
// can make a graph with multiple subgraphs easier
// prefix is a prefix used for all nodes in the graph
BinaryTree.prototype._dot_dump = function(prefix) {
    
    prefix = prefix == undefined ? "" : prefix;
    
    var dot_nodes = "";
    var dot_links = "";
    var current;
    var stack = [this];
    while( stack.length > 0 ) {
        current = stack.pop();
        dot_nodes += prefix + current.val + " [\n\tlabel = \"" + current.val + "\"\n];\n";     

        ["right", "left"].forEach( function(branch){
            if( current[branch] != undefined ) {
                stack.push( current[branch] );
                dot_links += prefix + current.val + " -> " + prefix + current[branch].val + "\n";
            }
        });
    }
    
    return dot_nodes + dot_links;
}

// returns the values that are in this tree and the other
BinaryTree.prototype.intersection = function( other ) {
    
    var a = this.iterator();
    var b = other.iterator();
    var out = [];
    
    var lowest = a.value() < b.value() ? a : b; // first item should exist    
    // there can only be intersection as long as both still have items
    while( a.hasNext() && b.hasNext() ) {
        // if equal: add to accumulator, and increase both iterators
        if( a.value() == b.value() ) {
            out.push( lowest.value() );
            a.next();
            b.next();
        } else {
            lowest.next(); // since they are in order, just move the lowest one along
        }
    }        
    
    return out;
}

// return a list of all values not in other
BinaryTree.prototype.elementsNotIn = function( other ) {
    
    var a = this.iterator();
    var b = other.iterator();
    var out = [];
    
    var lowest = a.value() < b.value() ? a : b; // first item should exist    
    while( a.hasNext() && b.hasNext() ) {
        // skip if equal
        if( a.value() == b.value() ) {
            a.next();
            b.next();
        } else {
            if( a.value() < b.value() ) {
                out.push( a.value() );
            }
            lowest.next(); // since they are in order, just move the lowest one along
        }
    }        
    // add anything left in a: we ran out of b
    while( a.hasNext() ) {
        out.push( a.value() );
        a.next();
    }
    
    return out;
}

// returns true if this tree is equal to the other, defined as having the same elements
// alsoStructure: optional, but if true this method also checks the tree structure
BinaryTree.prototype.equals = function( other, alsoStructure ) {
    
    alsoStructure = alsoStructure == undefined ? false : alsoStructure;

    if( !alsoStructure ) {
        // they have the same values if their intersection is maximal
        return tree.intersection( other ).length == this.values().length;
    }

    // actually check the structure
    if( this.val != other.val ) {
        return false;
    }
    
    // check if either of them has a left branch while the other doesn't
    if( this.left == undefined ^ other.left == undefined ) {
        return false;
    }

    if( this.right == undefined ^ other.right == undefined ) {
        return false;
    }

    // check their branches
    var leftEqual = this.left == undefined ? true : this.left.equals( other.left, true );
    var rightEqual = this.right == undefined ? true : this.right.equals( other.right, true );
    
    return leftEqual && rightEqual;    
}


// create a tree from a list of numbers
function treeFromList( numbers ) {
    var copy = numbers.slice(0);
    var tree = new BinaryTree( copy.shift() );
    copy.forEach( function(n) { tree.insert(n) } );
    return tree;
}

// preorder-LR traverse and print with spaces
function prettyPrint( tree, depth ) {
    
    if( tree == undefined ) {
        return;
    }
    
    depth = depth == undefined ? "" : depth;
    
    print( depth + tree.val );
    if( tree.left != null ) {
        prettyPrint( tree.left, depth + "  " );
    }
    if( tree.right != null ) {
        prettyPrint( tree.right, depth + "  " );
    }
}

