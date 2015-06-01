define([
	'AudioModule',
	'lodash'
], function(
	AudioModule,
	_
) {

	var EnvelopeGenerator = function( patch, id, context, element ) {

		this.name          = 'envelope-generator';
		this.patch         = patch;
		this.id            = id;
		this.context       = context;
		this.element       = element;
		this.attackTime    = 0.1;
		this.releaseTime   = 0.1;

		AudioModule.call( this );

		this.$attack       = this.renderKnob({
			knobLabel    : 'Attack',
			knobFunction : this.setAttack
		});
		this.$release      = this.renderKnob({
			knobLabel    : 'Release',
			knobFunction : this.setRelease
		});
    };

	EnvelopeGenerator.prototype = Object.create( AudioModule.prototype );
	EnvelopeGenerator.prototype.constructor = EnvelopeGenerator;

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
		}
    };    

    EnvelopeGenerator.prototype.setRelease = function( value ) {
    	if ( value ) {
			this.releaseTime = value * 0.01;
		}
	};

    EnvelopeGenerator.prototype.connect = function( moduleOutputIndex, module ) {
    	this.getAmplitude  = ( module.getAmplitude ) ? module.getAmplitude.bind( module ) : null;
		this.param         = module.amplitude;
    };

    return EnvelopeGenerator;
});