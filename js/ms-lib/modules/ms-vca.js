define([
	'Module'
], function(
	Module
) {

	var Vca = function( context, element ) {

		Module.call( this, 'vca', element );

		this.gain = context.createGain();
		this.gain.gain.value = 0;
		this.input = this.gain;
		this.output = this.gain;
		this.amplitude = this.gain.gain;
		this.$attack = this.renderKnob( 'Attenuator', this.attenuate, {}, 100 );
    };

	Vca.prototype = Object.create( Module.prototype );
	Vca.prototype.constructor = Module;

	Vca.prototype.getInnerHtml = function() {
		return (
			'<label>VCA</label>'
		);
	};

    Vca.prototype.attenuate = function( gainPercentage ) {
		this.output.gain.value = gainPercentage * 0.01;
    };

    Vca.prototype.connect = function( node ) {
		if (node.hasOwnProperty('input')) {
			this.output.connect(node.input);
		} else {
			this.output.connect(node);
		};
    };

	return Vca;
});