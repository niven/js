// jsc load for range() and shuffle()
load('utils.js');

// [1,8) in random order
var numbers = shuffle( range(1, 16) );
print( "Making tree out of: " + numbers );

function BinaryTree(val) {
    
    this.val = val;
}

// insert creates subtrees so we don't need to have null leaf pointers taking up space
BinaryTree.prototype.insert = function( n ) {
    
    if( n > this.val ) {
        if( this.right == undefined ) {
            this.right = new BinaryTree(n);
        } else {
            this.right.insert(n);    
        }
    } else {
        if( this.left == undefined ) {
            this.left = new BinaryTree(n);
        } else {
            this.left.insert(n);    
        }
    }
    
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

// make a tree
var tree = new BinaryTree( numbers.shift() );
numbers.forEach( function(n) {
    
    tree.insert( n );
    
});

// preorder traverse and print with spaces
function prettyPrint( tree, depth ) {
    
    depth = depth == undefined ? "" : depth;
    
    print( depth + tree.val );
    if( tree.left != null ) {
        prettyPrint( tree.left, depth + "  " );
    }
    if( tree.right != null ) {
        prettyPrint( tree.right, depth + "  " );
    }
}



prettyPrint( tree );
numbers = tree.values();
print( "values: " +  numbers + " sz: " + numbers.length);

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

var demerged = demerge(numbers);
print("Demerged: " + demerged);

var balanced = new BinaryTree( demerged.shift() );
demerged.forEach( function(n) {
    
    balanced.insert(n);
    
});
prettyPrint( balanced );

var it = tree.iterator();
var list = [];

do {
    list.push( it.value() );
    it.next();
} while( it.hasNext() );

print("iterated: " + list);

print("done");

