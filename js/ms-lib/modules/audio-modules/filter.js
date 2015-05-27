define([
	'AudioModule'
], function(
	AudioModule
) {

	var Filter = function( context, element ) {

		AudioModule.call( this, 'filter', element );

		this.filter                 = context.createBiquadFilter();
		this.filter.type            = 'lowpass';
		this.filter.frequency.value = 200;
		this.filter.Q.value         = 5;
		this.filter.gain.value      = 0.5;
		this.input                  = this.filter;
		this.output                 = this.filter;

		this.$freq = this.renderKnob({
			knobLabel    : 'Frequency',
			knobFunction : this.setFrequency,
			extraParams  : { min: 20, max: 10000, step: 25 },
			knobValue    : 500
		});

		this.$resonance = this.renderKnob({
			knobLabel    : 'Resonance',
			knobFunction : this.setResonance,
			extraParams  : { min: 0, max: 100 },
			knobValue    : 50
		});
    };

	Filter.prototype = Object.create( AudioModule.prototype );
	Filter.prototype.constructor = AudioModule;

	Filter.prototype.getInnerHtml = function() {
		return (
			'<label>Filter</label>'
		);
	};

    Filter.prototype.setFrequency = function( frequency ) {
    	this.filter.frequency.value = frequency;
    };

    Filter.prototype.setResonance = function( frequency ) {
    	this.filter.Q.value = frequency * 0.1;
    };

	return Filter;
});