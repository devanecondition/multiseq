require([
	'ms-vco',
	'ms-vca',
	'ms-envelope-gen',
	'ms-keyboard',
	'ms-sequencer'
], function(
	Vco,
	Vca,
	EnvelopeGenerator,
	Keyboard,
	Sequencer
) {

	// instantiate synth components...
	var context   = new AudioContext(),
		vco       = new Vco( context, 0 ),
		vca       = new Vca( context ),
		envelope  = new EnvelopeGenerator( context ),
		keyboard  = new Keyboard(),
		sequencer = new Sequencer();

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