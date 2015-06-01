define([
	'AudioModule',
	'state',
	'lodash'
], function(
	AudioModule,
	State,
	_
) {

	var Vco = function( patch, id, context, element ) {

		this.name            = 'vco';
		this.patch           = patch;
		this.id              = id;
		this.context         = context;
		this.element         = element;
		this.oscillator      = context.createOscillator();
		this.oscillator.type = 'sine';
		this.octave          = 3,
		this.input           = this.oscillator;
		this.output          = this.oscillator;
		this.fineTune        = 0;

		AudioModule.call( this );

		this.$tune           = this.renderKnob({
			$elem        : this.$module.find( '.dial' ),
			knobFunction : this.setFineTuning,
			extraParams  : { min: -20, max: 20 },
			knobValue    : 0
		});

		this.setFrequency(440);
		this.oscillator.start(0);

		this.$module
			.on( 'click', '.wave-type', _.bind( this.onWaveTypeChange, this ))
			.on( 'click', '.octave', _.bind( this.setOctave, this ));
	};

	Vco.prototype = Object.create( AudioModule.prototype );
	Vco.prototype.constructor = Vco;

	Vco.prototype.getModule = function() {
		return this.$module;
	}

	Vco.prototype.getInnerHtml = function() {
		return (
			'<label>VCO</label>' +
			'<p>Fine Tune</p>' +
			'<input type="text" class="dial">' +
			'<p>Wave Type</p>' +
			'<a href="#" title="Sine Wave" data-wave-type="sine" class="wave-type sine active"></a>' +
			'<a href="#" title="Square Wave" data-wave-type="square" class="wave-type square"></a>' +
			'<a href="#" title="Saw Wave" data-wave-type="sawtooth" class="wave-type saw"></a>' +
			'<a href="#" title="Triangle Wave" data-wave-type="triangle" class="wave-type triangle"></a>' +
			'<p>Octave</p>' +
			'<a href="#" data-octave-dir="down" class="octave down"></a>' +
			'<a href="#" data-octave-dir="up" class="octave up"></a>'
		);
	};

	Vco.prototype.setFineTuning = function( offset ) {
		this.fineTune = offset;
	};

	Vco.prototype.getFrequency = function( frequency ) {
		for ( var i = 0; i < this.octave; i++ ) {
			frequency = frequency * 2;
		}
		return frequency;
	};	

	Vco.prototype.setFrequency = function( frequency ) {

		frequency = this.getFrequency( frequency ) + this.fineTune;

		try {
			this.oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
		} catch(e) {
			console.log( 'no frequency detected' );
		}
	};

	Vco.prototype.setWaveType = function( waveType ) {
		this.oscillator.type = waveType;
	};	

	Vco.prototype.onWaveTypeChange = function( e ) {

		e.preventDefault();

		var $btn     = $( e.target ),
			waveType = $btn.data( 'waveType' );

		this.$module.find( '.wave-type' ).removeClass( 'active' );
		$btn.addClass( 'active' );
		this.setWaveType( waveType );
	};

	Vco.prototype.setOctave = function( e ) {

		e.preventDefault();

		var $this = $( e.target );

		if ( $this.hasClass( 'disabled') ) { return; }

		this.$module.find( '.octave' ).removeClass( 'disabled' );

		if ( $this.data( 'octave-dir' ) === 'down' ) {
			this.octave--;
		} else {
			this.octave++;
		}

		if ( this.octave === 0 || this.octave === 8 ) {
			$this.addClass( 'disabled' );
		}
	};

	return Vco;
});