define([
	'AudioModule'
], function(
	AudioModule
) {

	var Vca = function( params ) {

		this.name            = 'vca';
		this.patch           = patch;
		this.id              = id;
		this.context         = context;
		this.element         = element;
		this.gain            = context.createGain();
		this.gain.gain.value = 0;
		this.input           = this.gain;
		this.output          = this.gain;
		this.amplitude       = this.gain.gain;
		this.peakAmplitude   = 0.4;

		AudioModule.call( this );

		this.$attack         = this.renderKnob({
			knobLabel    : 'Attenuator',
			knobFunction : this.setAmplitude,
			knobValue    : 40
		});

		this.setAmplitude( 40 );
    };

	Vca.prototype = Object.create( AudioModule.prototype );
	Vca.prototype.constructor = Vca;

	Vca.prototype.getJacks = function() {
		return [
			{
				jackId : 0,
				type   : 'inlet'
			},
			{
				jackId : 0,
				type   : 'outlet'
			}
		];
	};

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

	return Vca;
});