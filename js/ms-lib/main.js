require([
	'ms-clock',
	'ms-vco',
	'ms-vca',
	'ms-envelope-gen',
	'ms-filter',
	'ms-delay',
	'ms-keyboard',
	'ms-sequencer'
], function(
	Clock,
	Vco,
	Vca,
	EnvelopeGenerator,
	Filter,
	Delay,
	Keyboard,
	Sequencer
) {

	// Safari fix...
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	// instantiate/render synth components...
	var $container = $( '<div class="synth-container"></div>' ).appendTo( 'body' ),
		context    = new AudioContext(),
		clock      = new Clock( $container ),
		sequencer  = new Sequencer( $container ),
		vco        = new Vco( context, $container ),
		vca        = new Vca( context, $container ),
		envelope   = new EnvelopeGenerator( context, $container ),
		filter     = new Filter( context, $container ),
		delay      = new Delay( context, $container ),
		keyboard   = new Keyboard( $container );

	// Patch the components...
	clock.connect( 0, sequencer );
	keyboard.connect( 0, vco );
	keyboard.connect( 1, envelope );
	keyboard.connect( 0, sequencer );
	keyboard.connect( 1, sequencer );
	sequencer.connect( 0, vco );
	sequencer.connect( 1, envelope );
	vco.connect( vca );
	envelope.connect( vca );
	vca.connect( filter );
	filter.connect( delay );
	filter.connect( context.destination );
	delay.connect( context.destination );
});