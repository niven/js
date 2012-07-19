// jsc load for range() and shuffle()
load('utils.js');

/*
	Searches a list of numbers for the target and returns the index of the element if found
	or -1 if not.
	
	Implementation uses a span to search and a midpoint in that span which seems more elegant
	than using a Left and Right index.
	
	A match is detected in the while loop instead of outside which is faster for a hit
	in a few cases but makes the algorithm more readable IMHO.
	
	Optimizations:
		Math.ceil(x/2) === (x+1)/2
		Math.floor(x/2) === x >> 1;
	But not in JavaScript :)
	
	Finally, this runs in
	O(n) = k * ceil( log_2(n) ) with k=6
	
	Trivia: originally written with pen and paper on holiday in about an hour 
		(including many unexpected bugs changing from L/R to span/mid)

*/
function binarySearch(list, target) {

	if(list == null || list.length == 0) {
		return -1;
	}

	// out of range
	if( target < list[0] || target > list[list.length-1] ) {
		return -1;
	}

	var span = list.length; // amount of the list to search
	var mid = Math.floor( span/2 ); // midpoint of the list
	while( span > 0 ) {
		if( target == list[mid] ) {
			return mid;
		}
		
		span = Math.floor( span/2 ); // guarantee exit of while eventually
		
		if( target < list[mid] ) {
			mid -= Math.ceil( span/2 );
		} else {
			mid += Math.ceil( span/2 );
		}
	}

	return -1;
}

// find each element in a list
var list = range(0, 15);
list.forEach(function(target){ 
	
	var idx = binarySearch(list, target);
	print("Found " + target + " at index " + idx + ": " + (list[idx] == target));
	
});

// edge cases
print("Target out of range (high): " + binarySearch([1,2,3], 9));
print("Target out of range (low): " + binarySearch([1,2,3], -5));
print("Empty list: " + binarySearch([], 7));
print("Null list: " + binarySearch(null, 6));
print("1 element list: " + (binarySearch([1], 1) == 0));
print("2 element list (left): " + (binarySearch([1,2], 1) == 0));
print("2 element list (right): " + (binarySearch([1,2], 2) == 1));
print("3 element list: " + (binarySearch([1,2,3], 3) == 2));

var odds = range(0,5).map(function(n){ return 2*n + 1 });
print("even number in list with odd elements: " + binarySearch(odds, 4) );