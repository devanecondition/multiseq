define([
	'Module'
], function(
	Module
) {

	var Vca = function( context, element ) {

		Module.call( this, 'vco', element );

		this.gain = context.createGain();
		this.gain.gain.value = 0;
		this.input = this.gain;
		this.output = this.gain;
		this.amplitude = this.gain.gain;
    };

	Vca.prototype = Object.create( Module.prototype );
	Vca.prototype.constructor = Module;

	Vca.prototype.getInnerHtml = function() {
		return (
			'<label>VCA</label>'
		);
	};

    Vca.prototype.connect = function( node ) {
		if (node.hasOwnProperty('input')) {
			this.output.connect(node.input);
		} else {
			this.output.connect(node);
		};
    }

	return Vca;
});