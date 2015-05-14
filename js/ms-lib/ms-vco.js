define([
	'ms-state',
	'lodash'
], function(
	State,
	_
) {

	var Vco = function ( context, seqIndex ) {
		this.context         = context;
		this.oscillator      = context.createOscillator();
		this.oscillator.type = this.oscillator.SINE;
		this.input           = this.oscillator;
		this.output          = this.oscillator;

		this.setFrequency(440);
		this.oscillator.start(0);

		this.$waveType = this.render().on( 'change', _.bind( this.onWaveTypeChange, this ));
	};

	Vco.prototype.render = function() {
		return $(
			'<select>' +
        		'<option value="sine">Sine</option>' +
        		'<option value="square">Square</option>' +
        		'<option value="sawtooth">Saw</option>' +
        		'<option value="triangle">Triangle</option>' +
    		'</select>'
		).appendTo('body');
	}

	Vco.prototype.setFrequency = function( frequency ) {
		this.oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
	};

	Vco.prototype.setWaveType = function( waveType ) {
		this.oscillator.type = waveType;
	};	

	Vco.prototype.connect = function(node) {
		if (node.hasOwnProperty('input')) {
			this.output.connect(node.input);
		} else {
			this.output.connect(node);
		};
	};

	Vco.prototype.onWaveTypeChange = function( e ) {

		var waveType = this.$waveType.val();

		// if ( waveType !== this.sequencer.waveType ) {
			// this.sequencer.waveType = waveType;
			this.setWaveType( waveType );
		// }
	};

	return Vco;
});