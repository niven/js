/*

Take a list of words, then find the longest chain of words that are all distance 1 apart (1 change, deletion, insertion).

*/

var dictionary = ["soon", "moon", "spoon", "bear", "orange", "beer"];
print("Dictionary: " + dictionary);

var neighbors = build_neighbor_table( dictionary );

var longest_chains = find_longest_chain( neighbors );

print("longest chains:");

longest_chains.forEach(function(c){print(c)});

/* Find the longest chain so that starting with word A we can hop to other words and end 
 * up at Z with a maximum number of hops. The constraint is that each intermediate word
 * can only be used once.
 *
 * Returns the longest chain(s) as [A, B, ..., Z]
 * and always includes every chain twice: backwards and forwards
 *
 * We do this by starting at each possible word and expanding them outward by 1 hop
 * if we can't hop any further in a certain chain, we eliminate that until 1 remains
 * (or until N remain of course)
 */
function find_longest_chain( graph ) {
	
	var chains = Object.keys(graph).map(function(word){
		return [word];
	});
	
	var expanded = chains;
	while( expanded.length > 0 ) {
		expanded = [];
		
		// replace each chain with every possible chain that is 1 hop longer
		for(var i=0; i<chains.length; i++) {
			var current_chain = chains[i];
			var endpoint = current_chain[ current_chain.length-1 ];
			var hops = graph[endpoint];
			
			// possible hops are those that haven't been taken yet
			var possible = hops.filter(function(hop){
				return !current_chain.some(function(visited){
					return visited == hop;
				});
			});
			
			// expand the current chain in with all possible hops
			for(var j=0; j<possible.length; j++) {
				expanded.push( current_chain.concat( possible[j] ) );
			}
		}

		// if we expanded nothing, the previous chains are the longest, so we want to keep them
		if( expanded.length > 0 ) {
			chains = expanded;
		}
	}
	
	return chains;
}

// create a dict where the keys are the words and the values the other words with distance 1
function build_neighbor_table( words ) {
	
	// bunch of nodes, some connected etc
	var table = {}; // "nodename": ["a", "b", ...] (edges)
	
	while( words.length > 0) {
		
		var current_word = words.pop();
		
		// find all neighbors in the graph
		var neighbors = Object.keys(table).filter(function(word){
			return levenshtein_distance(current_word, word) == 1;
		});
		
		// add the new node to the table
		table[current_word] = neighbors;
		
		// add this node the neighbors
		neighbors.forEach(function(nb){
			table[nb].push( current_word );
		});
	}
	
	return table;
}

function levenshtein_distance( s, t ) {
	var i,j,x,y;
	
	// if one is empty, then the distance is the length of the other
	if( s.length == 0 || t.length == 0) {
		return s.length + t.length;
	}
	
	var width = s.length + 1;
	var height = t.length + 1;
	
	// for all x and y, d[x,y] will hold the Levenshtein distance between
	// the first x characters of s and the first y characters of t;
	// note that d has (x+1)*(y+1) values
	// and since we have no 2d matrices, we make a 1d one with that size
	// where d[x,y] = d[y*width + x] (row major format)
	var d = new Array( width*height ); 
	for(x=0; x<width; x++) {
		d[x] = x; // horizontal top row
	}
	for(y=0; y<height; y++) {
		d[y*width + 0] = y; // vertical left row
	}

	var y_offset, x_offset, pos;
	for(x=0; x<s.length; x++) {
		for(y=0; y<t.length; y++) {
			// matrix is length of word +1
			y_offset = (y+1)*width;
			x_offset = x+1;
			pos = (y+1)*width + x+1;
			if( s[x] == t[y] ) { // just copy from our 'ancestor' up-left
				d[pos] = d[ y_offset-width + (x_offset-1) ];
			} else {
				d[pos] = Math.min(
                    d[y_offset + x_offset-1 ] + 1,  // a deletion
                    d[y_offset-width + x_offset] + 1,  // an insertion
                    d[y_offset-width + (x_offset-1)] + 1 // a substitution
				);
			}

		}
	}
	
	return d[ width*height -1];
}
