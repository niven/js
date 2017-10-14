/*
	Basic JS templating.

	template: string
	template variables: {foo}

	template_apply( str, data, queryselector, replace_content ) renders data in str and 
	appends (default) or replaces (if replace_content is true) to the element identified by queryselector.

	template_loop_apply does the same for an array of things.

	data can be nested: { account: { id: 1, level: 10 } } can be used as {account.id}
*/

if( document.createElement('template').content === undefined ) {
	throw "Can't create 'template' element";
}	
	
var TMPL_RAW = 1;
var TMPL_VAL = 2;

function template_parse( tmpl ) {

	// make train
	var train = [];
	var carriage = 0;

	// match template vars {foo}
	var tmpl_vars = /{[a-zA-Z0-9_.]*}/g;

	var pos = 0;
	var matches;
	while( (matches = tmpl_vars.exec( tmpl )) !== null ) {
	  train[carriage++] = { t:TMPL_RAW, v: tmpl.substr(pos, tmpl_vars.lastIndex - pos - matches[0].length ) };
	  train[carriage++] = { t:TMPL_VAL, v: matches[0].substr(1, matches[0].length-2) };
	  pos = tmpl_vars.lastIndex;
	}
	
	train[carriage] = { t:TMPL_RAW, v: tmpl.substr( pos ) };
	
	return train;
}	
	
function template_render( train, data ) {
	
	var result = train.map( (carriage) => {

		switch( carriage.t ) { // trains switch of course
			case TMPL_RAW: {
				return carriage.v;
			};
			case TMPL_VAL: {
				var parts = carriage.v.split('.');
				var val = undefined;

				do {
					val = (val || data)[parts.shift()] || undefined;
				} while (val !== undefined && parts.length);
				
				return val || "ERR_UNDEF(" + carriage.v + ")";
			};
			default: {
				throw "Unknow template type: " + carriage.t;
			}
		}

	});
	
	return result.join('');
}

function template_place( html_str, target, replace_content ) {

	var target_element = document.querySelector( target );

	if( replace_content ) {
		target_element.innerHTML = html_str;
	} else {
		// got through a template element to be able to create unparented <tr> and <li> elements
		var element = document.createElement('template');
		element.innerHTML = html_str;
		target_element.appendChild( element.content );
	}
}

function template_apply( tmpl, data, target, replace_content ) {

	var train = template_parse( tmpl );

	var result = template_render( train, data );
	
	template_place( result, target, replace_content );
}

function template_loop_apply( tmpl, data, target, replace_content ) {

	var train = template_parse( tmpl );

	var result = data.map(
		( el ) => { return template_render( train, el ) }
	).join('');

	template_place( result, target, replace_content );	
}
