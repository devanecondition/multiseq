define([
	'AudioModule'
], function(
	AudioModule
) {

	var Output = function( patch, id, context, element ) {
		this.name    = 'output';
		this.patch   = patch;
		this.id      = id;
		this.context = context;
		this.element = element;
		this.input   = context.destination;
		this.output  = context.destination;
    };

	Output.prototype = Object.create( AudioModule.prototype );
	Output.prototype.constructor = Output;

	return Output;
});