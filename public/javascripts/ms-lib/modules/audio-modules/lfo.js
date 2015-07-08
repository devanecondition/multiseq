define([
	'AudioModule',
	'state',
	'lodash'
], function(
	AudioModule,
	State,
	_
) {

	var Lfo = function( params ) {

		AudioModule.call( this, params, {
			waveType  : params.settings.waveType || 'sine',
			frequency : params.settings.frequency || 500
		});

		this.oscillator      = this.context.createOscillator();
		this.oscillator.type = this.stateData.waveType;
		this.input           = this.oscillator;
		this.output          = this.oscillator;
		this.lfoGain         = this.context.createGain();

		this.lfoGain.gain.value = 0.5;

		this.oscillator.connect( this.lfoGain );

		this.setFrequency( 0.5 );
		this.oscillator.start( 0 );

		this.$module
			.on( 'click', '.wave-type', _.bind( this.onWaveTypeChange, this ));
	};

	Lfo.prototype = Object.create( AudioModule.prototype );
	Lfo.prototype.constructor = Lfo;

	Lfo.prototype.getKnobs = function() {
		return [
			{
				$elem        : this.$module.find( '.dial' ),
				knobFunction : this.setFrequency,
				extraParams  : { min: 0.1, max: 50.0, step: 0.1 },
				knobValue    : 0.5
			}
		];
	};

	Lfo.prototype.getJacks = function() {
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

	Lfo.prototype.getInnerHtml = function() {
		return (
			'<label>LFO</label>' +
			'<p>Speed</p>' +
			'<input type="text" class="dial">' +
			'<p>Wave Type</p>' +
			'<a href="#" title="Sine Wave" data-wave-type="sine" class="wave-type sine active"></a>' +
			'<a href="#" title="Square Wave" data-wave-type="square" class="wave-type square"></a>' +
			'<a href="#" title="Saw Wave" data-wave-type="sawtooth" class="wave-type saw"></a>' +
			'<a href="#" title="Triangle Wave" data-wave-type="triangle" class="wave-type triangle"></a>'
		);
	};

	Lfo.prototype.setFrequency = function( frequency ) {

		frequency = frequency || 20;

		try {
			this.oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
			this.setModuleProperty( 'frequency', frequency );
		} catch(e) {
			console.log( 'no frequency detected' );
		}
	};

	Lfo.prototype.setWaveType = function( waveType ) {
		this.oscillator.type = waveType;
		this.setModuleProperty( 'waveType', waveType );
	};	

	Lfo.prototype.onWaveTypeChange = function( e ) {

		e.preventDefault();

		var $btn     = $( e.target ),
			waveType = $btn.data( 'waveType' );

		this.$module.find( '.wave-type' ).removeClass( 'active' );
		$btn.addClass( 'active' );
		this.setWaveType( waveType );
	};

	// Lfo.prototype.connect = function( moduleOutputIndex, module ) {
	// 	this.param = module.frequency;
 //    };

 	Lfo.prototype.connect = function( moduleOutputIndex, module ) {
    	this.getAmplitude  = ( module.getAmplitude ) ? module.getAmplitude.bind( module ) : null;
		this.lfoGain.connect( module.amplitude );
		this.oscillator.connect( module.amplitude );
    };

	return Lfo;
});