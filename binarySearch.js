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

/*
	Returns a list of numbers in order from start (inclusive) to end (exclusive)
	iterating over a range is thus the same as iterating with a for loop:
	
	range(0,10).forEach(function(i){ print(i) });
	
	is the same as
	for(var i=0; i<10; i++) {
		print(i);
	}
	
	of course iteration saves the creation of a list.
	
	The step parameter is optional and not needed for 0 -> -10 etc.
	
	Special case: if start==end then a list is returned with 1 element equal to start.
*/
function range(start, end, step) {

	if( step == undefined ) {
		step = end < start ? -1 : 1;
	}

	// if step is specified but in the "wrong direction": range(0, -10, 1)
	if( (end - start) / step < 0 ) {
		return null;
	}

	var out = new Array( Math.ceil((end - start) / step) );
	for(var i=0; i<out.length; i++) {
		out[i] = start + i*step;
	}
	
	if( out.length == 0 ) {
		out = [start];
	}

	return out;
}

/*
	Shuffle a list of numbers using Knuth shuffle.
	Uses Math.random() so don't use this for Serious Business(tm).
	This function changes the list in place.
*/
function shuffle(list) {

	if( list == null || list.length == 0 || list.length == 1) {
		return list;
	}

	// note: we never swap item 0 since it would swap with itself in the last iteration
	var swapIndex, swap;
	for(var i=list.length-1; i>0; i--) {
	
		swapIndex = Math.floor(Math.random() * (i + 1) );
	
		swap = list[i];
		list[i] = list[swapIndex];
		list[swapIndex] = swap;
	}

	return list;
}

print("done");