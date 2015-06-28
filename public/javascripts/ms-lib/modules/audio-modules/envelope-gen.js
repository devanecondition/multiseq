define([
	'AudioModule',
	'lodash'
], function(
	AudioModule,
	_
) {

	var EnvelopeGenerator = function( params ) {

		AudioModule.call( this, params, {
			attackTime  : params.settings.attackTime || 0.1,
			releaseTime : params.settings.releaseTime || 0.1
		});

		this.setAttack( this.stateData.attackTime );
		this.setRelease( this.stateData.releaseTime );

		this.$attack  = this.renderKnob({
			knobLabel    : 'Attack',
			knobFunction : this.setAttack,
			knobValue    : this.stateData.attackTime
		});
		this.$release = this.renderKnob({
			knobLabel    : 'Release',
			knobFunction : this.setRelease,
			knobValue    : this.stateData.releaseTime
		});
    };

	EnvelopeGenerator.prototype = Object.create( AudioModule.prototype );
	EnvelopeGenerator.prototype.constructor = EnvelopeGenerator;

	EnvelopeGenerator.prototype.getJacks = function() {
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

    EnvelopeGenerator.prototype.getInnerHtml = function() {
    	return (
			'<label>Envelope Generator</label>'
		);
	};

    EnvelopeGenerator.prototype.trigger = function() {

		var now           = this.context.currentTime,
			peakAmplitude = ( typeof this.getAmplitude === 'function' ) ? this.getAmplitude() : 1;

		this.param.cancelScheduledValues( now );
		this.param.setValueAtTime( 0, now );
		this.param.linearRampToValueAtTime( peakAmplitude, now + this.attackTime );
		this.param.linearRampToValueAtTime( 0, now + this.attackTime + this.releaseTime );
    };

    EnvelopeGenerator.prototype.setAttack = function( value ) {
    	if ( value ) {
			this.attackTime = value * 0.01;
			this.setModuleProperty( 'attackTime', value );
		}
    };    

    EnvelopeGenerator.prototype.setRelease = function( value ) {
    	if ( value ) {
			this.releaseTime = value * 0.01;
			this.setModuleProperty( 'releaseTime', value );
		}
	};

    EnvelopeGenerator.prototype.connect = function( moduleOutputIndex, module ) {
    	this.getAmplitude  = ( module.getAmplitude ) ? module.getAmplitude.bind( module ) : null;
		this.param         = module.amplitude;
    };

    EnvelopeGenerator.prototype.disconnect = function( moduleOutputIndex, module ) {
    	return true;
    };

    return EnvelopeGenerator;
});