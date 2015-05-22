define([
	'Module',
	'ms-state',
	'lodash'
], function(
	Module,
	State,
	_
) {

	var Vco = function ( context, element ) {

		Module.call( this, 'vco', element );

		this.context         = context;
		this.oscillator      = context.createOscillator();
		this.oscillator.type = this.oscillator.SINE;
		this.input           = this.oscillator;
		this.output          = this.oscillator;
		this.fineTune        = 0;
		this.$attack         = this.renderKnob( 'Fine Tune', this.setFineTuning, { min: -20, max: 20 }, 0 );

		this.setFrequency(440);
		this.oscillator.start(0);

		this.$module.on( 'click', '.wave-type', _.bind( this.onWaveTypeChange, this ));
	};

	Vco.prototype = Object.create( Module.prototype );
	Vco.prototype.constructor = Module;

	Vco.prototype.getInnerHtml = function() {
		return (
			'<label>VCO</label>' +
			'<a href="#" title="Sine Wave" data-wave-type="sine" class="wave-type sine active"></a>' +
			'<a href="#" title="Square Wave" data-wave-type="square" class="wave-type square"></a>' +
			'<a href="#" title="Saw Wave" data-wave-type="sawtooth" class="wave-type saw"></a>' +
			'<a href="#" title="Triangle Wave" data-wave-type="triangle" class="wave-type triangle"></a>' +
			'<div class="cb"></div>'
		);
	};

	Vco.prototype.setFineTuning = function( offset ) {
		this.fineTune = offset;
	};

	Vco.prototype.setFrequency = function( frequency ) {

		frequency = frequency + this.fineTune;

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

		var $btn     = $( e.target ),
			waveType = $btn.data( 'waveType' );

		// if ( waveType !== this.sequencer.waveType ) {
			// this.sequencer.waveType = waveType;
			this.$module.find( '.wave-type' ).removeClass( 'active' );
			$btn.addClass( 'active' );
			this.setWaveType( waveType );
		// }
	};

	return Vco;
});