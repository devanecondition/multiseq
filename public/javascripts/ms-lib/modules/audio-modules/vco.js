define([
	'AudioModule',
	'lodash'
], function(
	AudioModule,
	_
) {

	var Vco = function( params ) {

		AudioModule.call( this, params, {
			waveType  : params.settings.waveType || 'sine',
			frequency : params.settings.frequency || 110,
			octave    : params.settings.octave || 2,
			fineTune  : params.settings.fineTune || 0
		});

		this.oscillator      = this.context.createOscillator();
		this.oscillator.type = this.stateData.waveType;
		this.octave          = this.stateData.octave,
		this.input           = this.oscillator;
		this.output          = this.oscillator;
		this.fineTune        = this.stateData.fineTune;

		this.$tune = this.renderKnob({
			$elem        : this.$module.find( '.dial' ),
			knobFunction : this.setFineTuning,
			extraParams  : { min: -20, max: 20 },
			knobValue    : this.stateData.fineTune
		});

		this.setFrequency( this.stateData.frequency );
		this.oscillator.start( 0 );

		this.$module
			.on( 'click', '.wave-type', _.bind( this.onWaveTypeChange, this ))
			.on( 'click', '.octave', _.bind( this.setOctave, this ));
	};

	Vco.prototype = Object.create( AudioModule.prototype );
	Vco.prototype.constructor = Vco;

	Vco.prototype.getJacks = function() {
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

	Vco.prototype.buildButtons = function() {

		var waveTypes = [ 'sine', 'square', 'sawtooth', 'triangle' ],
			html      = '';

		_.each( waveTypes, function( waveType ) {
			var isActive  = ( waveType === this.stateData.waveType ) ? ' active' : '';
			html += '<a href="#" title="' + waveType + ' Wave" data-wave-type="' + waveType + '" class="wave-type ' + waveType + isActive + '"></a>';
		}, this );

		return html;
	},

	Vco.prototype.getInnerHtml = function() {
		return (
			'<label>VCO</label>' +
			'<p>Fine Tune</p>' +
			'<input type="text" class="dial">' +
			'<p>Wave Type</p>' +
			this.buildButtons() +
			'<p>Octave</p>' +
			'<a href="#" data-octave-dir="down" class="octave down"></a>' +
			'<a href="#" data-octave-dir="up" class="octave up"></a>'
		);
	};

	Vco.prototype.setFineTuning = function( offset ) {
		this.fineTune = offset;
		this.setModuleProperty( 'fineTune', offset );
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
			this.setModuleProperty( 'frequency', frequency );
		} catch(e) {
			console.log( 'no frequency detected' );
		}
	};

	Vco.prototype.setWaveType = function( waveType ) {
		this.oscillator.type = waveType;
		this.setModuleProperty( 'waveType', waveType );
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

		this.setModuleProperty( 'octave', this.octave );

		if ( this.octave === 0 || this.octave === 8 ) {
			$this.addClass( 'disabled' );
		}
	};

	return Vco;
});