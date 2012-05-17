// return a hash function (like Java toString())
var hash_num = 31;
function makehash(max) {
	var my_hash_num = hash_num;

	var hf = function(str) {

		return str.split("").reduce(
			function(prev, cur) {
				return (my_hash_num * prev) + cur.charCodeAt(0);
			}, 1) % max;

	}

	hash_num = hash_num + Math.ceil(hash_num/7) + 2;
	
	return hf;
}

function BloomFilter(capacity, false_positive_probability) {

	this.fpp = false_positive_probability;
	this.capacity = capacity;
	this.used = 0;
	
	// calculate bits required
	// (n ln(p)) / ln(2)^2
	
	this.bits =  (capacity * -Math.log(this.fpp)) / (Math.log(2) * Math.log(2) );
	// but we don't want 23.45 bit, we want some multiple of 8
	// since we will use chars as our bit-vectors (since JS doesn't have
	// ints but everything is a floating point behind the scenes)
	
	this.bits = Math.ceil(this.bits/8)*8;
	this.bitvector = [];
	while(this.bits --> 0) this.bitvector.push('\0');
	this.bits = this.bitvector.length*8;
	
	this.num_hash_functions = Math.ceil(((this.bitvector.length*8) / capacity) * Math.log(2));
	this.hash_functions = [];
	for(var i=0; i<this.num_hash_functions; i++) {
		this.hash_functions.push( makehash(this.bits) );
	}
	
	print("Bits: " + this.bits + ", hashes: " + this.num_hash_functions);
	
	return this;
}

// make bitvector readable (output 100111011 etc)
// don't do this when the vector is large unless you really like ones and zeroes on your screen
BloomFilter.prototype.pv = function() {
	var out = "";
	// use reverse() to counteract the prepending of the ones and zeroes
	// so we end up with nice left to right reading
	this.bitvector.reverse().forEach(function(letter) {
		var t = letter.charCodeAt(0);
		for(var j=8; j>0; t = t >> 1, j--){
			out = (t & 1) + out; // 0x1 displays as 00000001
		}
		out = " " + out;
	});
	this.bitvector.reverse(); // reverse back :)
	print("bitvec:" + out);
}

BloomFilter.prototype.add = function(number) {
	this.used++;
	
	this.hash_functions.forEach(function(hf) {
		var bit = hf(number, this.bits);

		// to set bit N, take byte N/8 and set its N%8 bit
		// since we want our vector to be nice and readable for debugging/understanding code
		// we actually keep everything in left-to-right bit order
		var c = this.bitvector[ bit/8 | 0].charCodeAt(0);// if you understand this optimization you da man.
		c |= 256 >> (bit % 8)+1; 
		this.bitvector[ bit/8 | 0] = String.fromCharCode(c);
		
		// yes, the above could be one line :)
		
	}, this);
}

BloomFilter.prototype.contains = function(number) {

	var contained = true;
	this.hash_functions.forEach(function(hf) {
		var bit = hf(number, this.bits);
		var c = this.bitvector[ bit/8 | 0].charCodeAt(0);
		contained = contained && (c & (256 >> (bit % 8)+1));
	}, this);
	
	return contained > 0;
}

BloomFilter.prototype.elements = function() {
	return this.used;
}




print("Creating Bloom Filter with capacity 100, false positive ratio 1/200");
var bf = new BloomFilter(100, 1/200);


["foo", "bar", "rez", "qux", "pok", "zup"].forEach(function(el){
	print("inserting " + el);
	bf.add(el);
	print("Contains " + el + "? " + bf.contains(el));
});



["foo1", "bar1", "rez1"].forEach(function(el){
	print("Contains " + el + "? " + bf.contains(el));
});


print("Elements: " + bf.elements());

print("Done");