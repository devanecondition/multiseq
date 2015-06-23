define([
	'AudioModule'
], function(
	AudioModule
) {

	var Output = function( params ) {
		this.name    = 'output';
		this.patch   = patch;
		this.id      = id;
		this.context = context;
		this.element = element;
		this.input   = context.destination;
		this.output  = context.destination;

		AudioModule.call( this );
    };

	Output.prototype = Object.create( AudioModule.prototype );
	Output.prototype.constructor = Output;

	Output.prototype.getJacks = function() {
		return [
			{
				jackId : 0,
				type   : 'inlet'
			}
		];
	};

	Output.prototype.getInnerHtml = function() {
		return (
			'<label>Output</label>'
		);
	};

	return Output;
});