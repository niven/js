load('BinaryTree.js');

// [1,16) in random order
var numbers = shuffle( range(1, 16) );
print( "Making tree out of: " + numbers );

// make a tree
var tree = treeFromList(numbers);

prettyPrint( tree );
print( "Values in tree: " + tree.values());

// iteration
var it = tree.iterator();
var list = [];

do {
    list.push( it.value() );
    it.next();
} while( it.hasNext() );

print("Values from iteration: " + list);

// Balance the tree
tree.balance();
print("Balanced: ");
prettyPrint( tree );

print("Subtree of 10:");
prettyPrint( tree.find(10) );

print("Subtree of -8: " + tree.find(-8) );

print("Removing 6: " + tree.remove(6) );
prettyPrint(tree);
print("Removing 7: " + tree.remove(7) );
prettyPrint(tree);
print("Removing 5: " + tree.remove(5) );
prettyPrint(tree);

print("Removing 8: " + tree.remove(8) );
prettyPrint(tree);

var tree2 = treeFromList( shuffle([11, 12, 13, 15, 16, 17, 18]) );
print("Making tree2: ");
prettyPrint( tree2 );

print("intersection with tree2: " + tree.intersection(tree2));

print("elements in tree but not in tree2: " + tree.elementsNotIn( tree2 ) );
print("elements in tree2 but not in tree: " + tree2.elementsNotIn( tree ) );

print("tree equals tree2 (values): " + tree.equals(tree2) );

print("Comparing tree(1,2,3) with tree(1,2,3) (values): " + treeFromList([1,2,3]).equals(treeFromList([1,2,3])));
print("Comparing tree(1,2,3) with tree(1,2,3) (values+structure): " + treeFromList([1,2,3]).equals(treeFromList([1,2,3]), true));
print("Comparing tree(1,2,3) with tree(3,2,1) (values): " + treeFromList([1,2,3]).equals(treeFromList([3,2,1])));
print("Comparing tree(1,2,3) with tree(3,2,1) (values+structure): " + treeFromList([1,2,3]).equals(treeFromList([3,2,1]), true));

print("done");