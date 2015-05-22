require([
	'ms-clock',
	'ms-vco',
	'ms-vca',
	'ms-envelope-gen',
	'ms-keyboard',
	'ms-sequencer'
], function(
	Clock,
	Vco,
	Vca,
	EnvelopeGenerator,
	Keyboard,
	Sequencer
) {

	// instantiate/render synth components...
	var context   = new AudioContext(),
		clock     = new Clock(),
		vco       = new Vco( context ),
		vca       = new Vca( context ),
		envelope  = new EnvelopeGenerator( context ),
		sequencer = new Sequencer(),
		keyboard  = new Keyboard();

	// Patch the components...
	keyboard.connect( 0, vco );
	keyboard.connect( 1, envelope );
	keyboard.connect( 0, sequencer );
	keyboard.connect( 1, sequencer );
	sequencer.connect( 0, vco );
	sequencer.connect( 1, envelope );
	vco.connect( vca );
	envelope.connect( vca.amplitude )
	vca.connect( context.destination );	
});