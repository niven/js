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
	for(var i = 0; i < out.length; i++) {
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
	for(var i = list.length-1; i > 0; i--) {
	
		swapIndex = Math.floor(Math.random() * (i + 1) );
	
		swap = list[i];
		list[i] = list[swapIndex];
		list[swapIndex] = swap;
	}

	return list;
}

/*
    Create and return a list of size items created by the generator function
*/
function makeList(size, generator) {
    
    var out = new Array(size);
    
    for(var i=0; i<size; i++) {
        out[i] = generator();
    }
    
    return out;
}


function dump( obj, indent ) {

	if( indent === undefined ) {
		indent = "";
	}

	if( typeof(obj) === 'object' ) {
		
		if( obj instanceof Array ) {
			
			if( obj.length == 0 ) {
				return "[]";
			}
			
			var out = "\n";
			for(var i=0; i<obj.length; i++) {
				 out += indent + "[" + i + "] = " + dump(obj[i], indent + "  ") + ",\n";
			}
			return out;
		}
		
		var out = "{\n";
		for( key in obj ) {
			out += indent + "'" + key + "': " + dump(obj[key], indent + "  ") + ",\n";
		}
		return out + indent + "}"
	} else if( typeof(obj) == "function" ) {
		return "function()";
	} else if ( typeof(obj) == "string" ) {
		return "\"" + obj + "\"";
	} else if( typeof(obj) == "number" ) {
		return obj;
	} else {
		return typeof(obj) + " -> " + obj;
	}
	
}

function strFromMatrix( m, width ) {
	var out = "";
	out += "/ ";
	for(var j=0; j<width; j++) {
		out += m[j] + " ";
	} 
	out += " \\\n";
	for(var i=1; i<(m.length/width)-1; i++) {
		out += "| ";
		for(var j=0; j<width; j++) {
			out += (m[i*width+j] === undefined ? "_" : m[i*width+j]) + " ";
		} 
		out += " |\n";
	}
	if( m.length > 0 ) {
		out += "\\ ";
		for(var j=0; j<width; j++) {
			out += (m[m.length-width+j] === undefined ? "_" : m[m.length-width+j]) + " ";
		} 
		out += " /\n";
	}
	
	return out;
}
