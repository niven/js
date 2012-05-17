/* In this file 2 ways of creating a frequency distribution of dice throws, 
 * including big O notation for memory and instructions for comparison and edification.
 *
 * Method 1: freq(dice) - create all possible permutations of dice throws and then count.
 *
 * Method 2: flat(dice) - use an array to keep track of possible values we can "reach"
 *							and the number of ways we can reach them
 *
 * Thanks go to Damian Gryski for lunch discussions, now I'm off to study groups
 * to see if I can exploit the symmetries in this problem to reduce computation.
 */


// Create permutations given a list of numbers and a number defining a new set of numbers [1..dice]
function permute( items, dice ) {
	var out = [];
	if( items.length == 0 ) {
		while(dice --> 0) {
			out.push([dice+1]);
		}
		return out.reverse();
	}
	for(var i=1; i <= dice; i++) {
		items.forEach(function(el){
					var copy = el.slice();
					copy.push(i);
					out.push( copy )
		});

			
	}
	return out;
}

// flatten a list of lists (1 deep max)
function flatten( ll ) {
	var out = {};
	
	for(var i=0; i<ll.length; i++) {
		var val = ll[i].reduce(function(a,b){ return a+b });
		out[ val ] = out[ val ] == undefined ? 1 : out[ val ] + 1;
	}
	
	return out;
} 

// prettyprint non-nested hash
function po(obj) {
	
	var out = "{\n";
	for(var key in obj) {
		out += "\t" + key + ":\t" + obj[key] + "\n";
	}
	return out + "\n}";

}



// uses O(k^N) memory
// takes O( 2* (k^N)  ) operations
// k = avg dice size
// example: 1d4 + 1d6 is 24 permutations in memory, then 24 more operations to flatten to frequency table
// it's pretty bad
function freq(dice) {

	var p = [];
	dice.forEach(function(el){
		p = permute(p, el);
	});
	return flatten(p);
}


print("Creating permutations: 2d4+1d6", po(freq([4,4,6])));



// using only O(2*N) memory
// but still many operations:  O( k^N )
// k = avg dice size
function flat(dice) {

	var a = [0];
	var max = 0;
	
	dice.forEach(function(die, idx){

		var old = a.slice();
		
		var init = a.length + die;
		a = [];
		while( init --> 0 ) { a.push(0) };


		// take all numbers we had (indices of the a array between idx and max)
		// and add all values of die faces to it to get the new totals we could reach
		// in the array val we keep track of the many ways.

		for(var total=idx; total<=max; total++) {

			for(var face=1; face <= die; face++) {

				var freq_of_prev = old[ total ] == 0 ? 1 : old[ total ];
				a[ total+face ] = freq_of_prev + a[ total+face ];
			}
		}
		max += die; // now highest value we can reach

	});
	
	return a;
}




print("Flat array 2d4+1d6: " + flat([4,4,6]));


































