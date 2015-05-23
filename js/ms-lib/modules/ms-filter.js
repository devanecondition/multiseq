define([
	'Module'
], function(
	Module
) {

	var Filter = function( context, element ) {

		Module.call( this, 'filter', element );

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

	Filter.prototype = Object.create( Module.prototype );
	Filter.prototype.constructor = Module;

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

    Filter.prototype.connect = function( node ) {
		if (node.hasOwnProperty('input')) {
			this.output.connect(node.input);
		} else {
			this.output.connect(node);
		};
    };

	return Filter;
});