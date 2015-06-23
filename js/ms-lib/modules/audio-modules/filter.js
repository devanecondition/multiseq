define([
	'AudioModule'
], function(
	AudioModule
) {

	var Filter = function( params ) {

		this.stateData = {
			id        : params.settings.id || params.id,
			name      : params.settings.name || 'filter',
			frequency : params.settings.frequency || 500,
			resonance : params.settings.resonance || 50
		};

		this.patch          = params.patch;
		this.state          = this.patch.state;
		this.context        = params.context;
		this.element        = params.element;
		this.filter         = this.context.createBiquadFilter();
		this.filter.type    = 'lowpass';
		this.filter.Q.value = 5;
		this.input          = this.filter;
		this.output         = this.filter;

		AudioModule.call( this );

		this.setFrequency( this.stateData.frequency );
		this.setResonance( this.stateData.resonance );

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
	Filter.prototype.constructor = Filter;

	Filter.prototype.getJacks = function() {
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