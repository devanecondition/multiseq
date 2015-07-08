define([
	'AudioModule'
], function(
	AudioModule
) {

	var Filter = function( params ) {

		AudioModule.call( this, params, {
			frequency : params.settings.frequency || 500,
			resonance : params.settings.resonance || 50
		});

		this.filter         = params.context.createBiquadFilter();
		this.filter.type    = 'lowpass';
		this.filter.Q.value = 5;
		this.input          = this.filter;
		this.output         = this.filter;

		this.setFrequency( this.stateData.frequency );
		this.setResonance( this.stateData.resonance );
    };

	Filter.prototype = Object.create( AudioModule.prototype );
	Filter.prototype.constructor = Filter;

	Filter.prototype.getKnobs = function() {
		return [
			{
				knobLabel    : 'Frequency',
				knobFunction : this.setFrequency,
				extraParams  : { min: 20, max: 10000, step: 25 },
				knobValue    : this.stateData.frequency
			},
			{
				knobLabel    : 'Resonance',
				knobFunction : this.setResonance,
				extraParams  : { min: 0, max: 100 },
				knobValue    : this.stateData.resonance
			}
		];
	};

	Filter.prototype.getJacks = function() {
		return [
			{
				name   : 'Audio In',
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

	Filter.prototype.getInnerHtml = function() {
		return (
			'<label>Filter</label>'
		);
	};

    Filter.prototype.setFrequency = function( frequency ) {
    	this.filter.frequency.value = frequency;
    	this.setModuleProperty( 'frequency', frequency );
    };

    Filter.prototype.setResonance = function( frequency ) {
    	this.filter.Q.value = frequency * 0.1;
    	this.setModuleProperty( 'resonance', frequency );
    };

	return Filter;
});