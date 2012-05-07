
function Node(next, value) {
	this.next = next;
	this.value = value;
}

/**
 * Prettify a list as [2]->[3]->[5]->[7]
 */
function list2str(head) {
	
	var out = "";

	for(var node = head; node.next != null; node = node.next) {
			out += "[" + node.value + "]->";
	}
	return out + "[" + node.value + "]";

}

function obj2str(obj) {
	var out = "{";
	for(var key in obj) {
		out += "\t'" + key + "':\t" + obj[key] + "\n";
	}
	return out + "}";
}

/**
 * add a number to a list of Nodes, in order.
 * Returns the head, since a node could be prepended
 */
function insertInOrder(head, node) {

	if( head.value > node.value ) { // prepend
		node.next = head;
		head = node;
	} else { // append
		var current = head;
		while( current.next != null && node.value > current.next.value ) { // subtle
			current = current.next;
		}
		node.next = current.next;
		current.next = node; // current.next is null if tail
	}
	return head;
}

/**
 * Return a list of N elements of numbers in range [min, max], optionally ordered
 */
function makeList(num_elements, min, max, ordered) {

	var ordered = ordered == undefined ? false : ordered;

	var number = function() {
		return min + Math.ceil(Math.random() * (max-min));
	};

	var head = new Node(null, number());
	for(var j=1; j<num_elements; j++) { // insert elements
		var newVal = number();
		
		head = ordered ? insertInOrder(head, new Node(null, newVal)) : new Node(head, newVal);

	}
	return head;
}

// setup lists
var NUM_LISTS = 10;
var NUM_LIST_ELEMENTS = 1000;
var INT_RANGE = 5000;

print("Lists: " + NUM_LISTS + ", elements per list: " + NUM_LIST_ELEMENTS);

var list = [];
for(var i=0; i<NUM_LISTS; i++) {
	list[i] = makeList(NUM_LIST_ELEMENTS, 1, INT_RANGE, true);
	//print("List " + i + ": " + list2str(list[i]));
}

// now we emit all numbers that occur in at least P lists, where P <= N
var N = list.length;
var M = list[0].length;
var P = 5;

print("All numbers occurring in at least " + P + "/" + N + " lists:");

/*
Method:
create an ordered list of all the heads. (storage N)
count the elements using a hash (storage max N)

check if the _lowest_ number occur in P lists, if so remove them && emit.

Then: remove lowest number(s) (easy, since list is ordered)
replace with next from the list, insert maintaining order.

repeat.

duplicate numbers in list
*/

// act like a Node, don't tell anyone :)
function HeadNode(node, listIndex) {
	this.listPtr = node;
	this.value = node.value;
	// also keep listindex
	this.listIndex = listIndex;
}

var front = new HeadNode(list.pop(), 0);
var headCount = {};
headCount[front.value] = 1;

// add each list head to a new list, in order
list.forEach( function(el, idx, arr){
	var node = new HeadNode(el, idx+1);
	front = insertInOrder(front, node);
	// also count
	headCount[el.value] = headCount[el.value] == undefined ? 1 : headCount[el.value]+1;
});

var shared = [];
var lastFound = -1;
while( Object.keys(headCount).length > 0) {

	//print("headnodes: " + list2str(front) + "\ncounts: \n" + obj2str(headCount) );

	// now see if we have any numbers to emit
	var lowest = front;
	var occurences = headCount[lowest.value];
	//print("lowest: " + lowest.value);
	
	// checking for lastFound will eliminate duplicates
	if(occurences >= P && lowest.value != lastFound) {
		print(lowest.value + " occurs " + occurences + " times");
		lastFound = lowest.value;
		shared.push(lowest.value);
	} 

	// get rid of lowest
	delete headCount[lowest.value];
	// and move it (and all others that are the same) off the headNodes list
	// for every occurrence, we advance that pointer to the next of it's list,
	// and insert that in order, while counting (maybe read that a few times :)
	for(var del = front; occurences-- > 0; del=del.next) {
		var nextInList = del.listPtr.next;
		//print("del: "+ del.value + " from list " +  del.listIndex);

		if( del.next != null && nextInList != null ) {
			//print("next from list " + del.listIndex + ": " + nextInList.value);
			front = insertInOrder(del.next, new HeadNode(nextInList, del.listIndex));
			//print("incrementing counter for " + nextInList.value);
			headCount[nextInList.value] = headCount[nextInList.value] == undefined ? 1 : headCount[nextInList.value]+1;
		} else {
			//print("reached end of list " + del.listIndex);
			front = front.next;
		}
	}

	//print("numbers left in counter: " + Object.keys(headCount).length);

}
	//print("headnodes: " + list2str(front) + "\ncounts: \n" + obj2str(headCount) );
print("Shared: " + shared);
print("DONE");




























