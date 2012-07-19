// jsc specific thing
load('utils.js');

/*
	Sorts a list of numbers using mergesort.
	
	Modifies the list in place, and is a stable sort.
	
	Implementation: subdivides the list into pairs and swaps those if necessary to order
	them, then merges until the entire list is sorted.
	
	Uses a temporary array of the length of the input list for merging.
		
	Trivia: written on paper on holiday to discover all the ways this can go wrong.
		Which I did, repeatedly. I'm pretty sure this is bug free by now though :)
		
*/
function mergeSort(list) {

	if( list == null || list.length == 0 ) {
		return [];
	}

	if( list.length == 1 ) {
		return list;
	}
	
	//--- First: divide the array in pairs and sort those
	
	// (instead of pairs you could pick a larger number and use a different sorting algorithm)
	
	// for a list with an odd number of elements we don't need to sort the remaining single element.
	var pairs = Math.floor( list.length/2 );
	var swap;
	for(var i = 0; i < 2*pairs; i += 2) {
		if( list[i] > list[i+1] ) {
			swap = list[i];
			list[i] = list[i+1];
			list[i+1] = swap;
		}
	}
	
	//--- Second: perform the merge
	
	var buf = new Array(list.length);
	var swap;
	var mergeLength = 2; // start with the pairs that are sorted
	while( mergeLength < list.length ) {

		// merge k pairs of size mergeLength
		for(var start = 0; start < list.length; start += 2*mergeLength) {
			// use indices for the Left of the pair and the Right of the pair
			var L = start;
			var R = start + mergeLength;
			var L_end = Math.min(R - 1, list.length - 1);
			var R_end = Math.min(R+mergeLength-1, list.length - 1);
			var to = 0;
			
			while( start + to <= R_end ) { // we always know how many elements to merge
				
				// copy as many from the left pair as we can
				// (short-circuit evaluation means we never acces list[R] if R is out of bounds)
				while( L <= L_end && (R > R_end || list[L] <= list[R] ) ) {
					buf[start + to] = list[L];
					to++;
					L++;
				}
				
				// then copy as many as we can from the right pair
				while( R <= R_end && (L > L_end || list[R] < list[L] ) ) {
					buf[start + to] = list[R];
					to++;
					R++;
				}

			}

		}
		// reset the source array for merging
		swap = list;
		list = buf;
		buf = swap;
		
		mergeLength *= 2;
	}
	
	return list;
}



// all distinct cases I could come up with
var lists = [
	null,
	[],
	[1],
	[1,1],
	[1,2],
	[2,1],
	[3,2,1],
	[4,3,2,1],
	[3,3,2,2,1,1],
	[4,3,3,2,2,1,1],
	shuffle( range(0,10) ),
	shuffle( range(-5,5) ),
	shuffle( range(1,10,2) ),
//	shuffle( range(0,1000 * 1000) ) // takes a while to print
];

lists.forEach( function(list) {

	var result = mergeSort(list);
	print( list + ": " + result + " sorted: " + isSorted(result) );

});



/*
	Returns true if list is sorted in ascending order
*/
function isSorted(list) {

	if( list == null || list.length < 2 ) {
		return true;
	}
	
	for(var i=1; i<list.length; i++) {
		if( list[i] < list[i-1] ) {
			return false;
		}	
	}
	
	return true;

}
