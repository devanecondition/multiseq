define([
	'lodash'
], function(
	_
) {

	var EnvelopeGenerator = function( context ) {
		this.context     = context;
		this.attackTime  = 0.1;
		this.releaseTime = 0.1;
		this.$envelope   = $( this.getHtml() ).appendTo('body');
		this.$attack     = this.renderKnob( 'Attack', this.setAttack );
		this.$release    = this.renderKnob( 'Release', this.setRelease );
    };

    EnvelopeGenerator.prototype.getHtml = function() {
    	return (
			'<div class="env-gen">' +
				'<label>Envelope Generator</label>' +
			'</div>'
		);
	};

    EnvelopeGenerator.prototype.renderKnob = function( label, knobFunction ) {

		var knobSettings = {
			fgColor     : "#999",
			inputColor  : '#666',
			width       : 150,
			angleOffset : -125,
			angleArc    : 250,
			change      : _.bind( knobFunction, this )
		};

    	return $( '<input type="text" value="10" class="dial">' ).knob( knobSettings ).appendTo( this.$envelope );
	};

    EnvelopeGenerator.prototype.trigger = function() {
		var now = this.context.currentTime;
		this.param.cancelScheduledValues(now);
		this.param.setValueAtTime(0, now);
		this.param.linearRampToValueAtTime(1, now + this.attackTime);
		this.param.linearRampToValueAtTime(0, now + this.attackTime + this.releaseTime);
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

    EnvelopeGenerator.prototype.connect = function( param ) {
		this.param = param;
    };

    return EnvelopeGenerator;
});