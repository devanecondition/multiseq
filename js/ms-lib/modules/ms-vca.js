define([
	'Module'
], function(
	Module
) {

	var Vca = function( context, element ) {

		Module.call( this, 'vca', element );

		this.gain            = context.createGain();
		this.gain.gain.value = 0;
		this.input           = this.gain;
		this.output          = this.gain;
		this.amplitude       = this.gain.gain;
		this.peakAmplitude   = 0.4;
		this.$attack         = this.renderKnob({
			knobLabel    : 'Attenuator',
			knobFunction : this.setAmplitude,
			knobValue    : 40
		});

		this.setAmplitude( 40 );
    };

	Vca.prototype = Object.create( Module.prototype );
	Vca.prototype.constructor = Module;

	Vca.prototype.getInnerHtml = function() {
		return (
			'<label>VCA</label>'
		);
	};

    Vca.prototype.setAmplitude = function( gainPercentage ) {
		this.peakAmplitude = gainPercentage * 0.01;
    };

    Vca.prototype.getAmplitude = function() {
		return this.peakAmplitude;
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