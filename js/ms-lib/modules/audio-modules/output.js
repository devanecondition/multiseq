define([
	'AudioModule'
], function(
	AudioModule
) {

	var Output = function( params ) {

		AudioModule.call( this, params );

		this.input  = this.context.destination;
		this.output = this.context.destination;
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