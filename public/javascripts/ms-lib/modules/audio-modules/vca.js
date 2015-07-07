define([
	'AudioModule'
], function(
	AudioModule
) {

	var Vca = function( params ) {

		AudioModule.call( this, params, {
			peakAmplitude : params.settings.peakAmplitude || 40
		});

		this.gain            = this.context.createGain();
		this.gain.gain.value = 0;
		this.input           = this.gain;
		this.output          = this.gain;
		this.amplitude       = this.gain.gain;

		this.setAmplitude( this.stateData.peakAmplitude );

		this.$attack         = this.renderKnob({
			knobLabel    : 'Attenuator',
			knobFunction : this.setAmplitude,
			knobValue    : this.stateData.peakAmplitude
		});
    };

	Vca.prototype = Object.create( AudioModule.prototype );
	Vca.prototype.constructor = Vca;

	Vca.prototype.getJacks = function() {
		return [
			{
				name   : 'Audio/Env',
				jackId : 0,
				type   : 'inlet'
			},
			{
				name   : 'Audio Out',
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
		this.setModuleProperty( 'peakAmplitude', gainPercentage );
    };

    Vca.prototype.getAmplitude = function() {
		return this.peakAmplitude;
    };

	return Vca;
});