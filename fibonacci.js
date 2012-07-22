/*
	Iteratively calculate the Nth Fibonacci number in O(log_2 n) steps.
	
	Rewritten from the Clojure solution I wrote when going over the
	Structure and Interpretation of Computer Programs.
	
	So how much faster is it?
	
	Normal approach:
	var a = 1, b = 0, temp;
	while( n > 0 ) {
		temp = a + b;
		b = a;
		a = temp;
		n--;
	}
	
	takes 6 operations for every n, so that algorithm is O(n) = 6n
	
	While this one takes between 13 and 16, so O(n) = ~14.5 * log_2(n)
	which is an improvement for n > 6.
	
*/
function fibonacci(n) {

	/*
		Fibonacci number Fn = F(n-1) + F(n-2) with F(1) = 1 and F(0) = 0
		
		So to get the Nth number, you repeat the steps
		a = a + b
		b = a
		
		N times and the result is in b.
	
		However, much like exponentiation can be done in log(n) steps by taking
		advantage of the fact that a^n = (a^(n/2))^2 for even n, we can do something
		similar. 
		
		Example: 
			b^8 = (b^4)^2 = ((b*b)^2)^2
		Which takes only 3 steps.
		
	*/

	var a = 1; // fib(1)
	var b = 0; // fib(0)
	var p = 0;
	var q = 1;
	
	/*
		So what are p and q doing here?
		
		(warning: math :)
		
		Recall:
		a = a + b
		b = a
		
		We call this transformation T_ab

		We can rewrite T_ab as T_pq as follows:		
		T_pq:
		a = bq +aq + ap
		b = bp + aq
		with p=0 and q=1
		
		Now, T_pq squared:
		
		(1)
		a = bq + aq + ap
		b = bp + aq
		
		(substitute a with the expesssion for a, likewise b)
		a = (bp + aq)q +(bq +aq + ap)q + (bq +aq + ap)p
		b = (bp + aq)p + (bq +aq + ap)q
		
		simplify
		a = bpq + aq^2 + bq^2 + aq^2 + apq + bpq + apq + ap^2
		b = bp^2 + apq + bq^2 + aq^2 + apq
		
		again
		a = 2bpq + 2aq^2 + 2apq + bq^2 + ap^2
		b = bp^2 + 2apq + bq^2 + aq^2
		
		now, we want p' and q' so we can rewrite (1) in terms of p' and q'
		start with b because that seems easier:
		b = bp + aq, so we want to express 
		b = bp^2 + 2apq + bq^2 + aq^2 in terms of b*(something) and a*(something)
		
		b = bp^2 + bq^2 + 2apq + aq^2
		b = b(p^2 + q^2) + a(2pq + q^2)
		
		so
		p' = p^2 + q^2
		q' = 2pq + q^2
		and
		b = bp' + aq'
		
		Cool. now also rewrite a to verify:
		a = 2bpq + 2aq^2 + 2apq + bq^2 + ap^2
		a = b(2pq + q^2) + a(2pq + q^2) + a(q^2 + p^2) 
		a = bq' + aq' + ap'
		So that checks out.
		
		So in order to calculate T_pq^2 we can express p' and q' in terms of p and q:
		
		p' = p^2 + q^2
		q' = 2pq + q^2
	*/
		
	var temp;
	while( n > 0 ) {
		if( n % 2 == 0 ) { // n is even, use T_pq^2
			temp = p*p + q*q; // p', but we still need p to compute q'
			q = 2*p*q + q*q;
			p = temp;
			n = Math.floor(n/2);
		} else { // n is odd, just T_pq
			temp = b*q + a*q + a*p; // new a, but we need the old value to compute b
			b = b*p + a*q;
			a = temp;
			n--;
		}
	}

	return b;
}

for(var i=0; i<30; i++) {
	print("F(" + i + ") = " + fibonacci(i));
}

print("Done");