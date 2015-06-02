require([
	'menu',
	'Patch',
	'lodash'
], function(
	menu,
	Patch,
	_
) {

	// Safari fix...
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	var $wrapper = $( '<div></div> '),
		patch    = new Patch(), // Create a new patch...
		menu     = new menu( patch );  // Build top menu...

	$wrapper
		.append( menu.getElem() )
		.append( patch.getElem() );

	$wrapper.appendTo('body');

	// // instantiate/render synth components...
	// _.each( modules, patch.addModule.bind( patch ) );

	// // Patch the components...
	// patch.makeConnection( 0, 0, 1 ); // clock 0 to sequencer
	// patch.makeConnection( 7, 0, 2 ); // keyboard 0 to vco
	// patch.makeConnection( 7, 1, 4 ); // keyboard 1 to envelope
	// patch.makeConnection( 7, 0, 1 ); // keyboard 0 to sequencer
	// patch.makeConnection( 7, 1, 1 ); // keyboard 1 to sequencer
	// patch.makeConnection( 1, 0, 2 ); // sequencer 0 to vco
	// patch.makeConnection( 1, 1, 4 ); // sequencer 1 to envelope
	// patch.makeConnection( 2, 0, 3 ); // vco 0 to vca
	// patch.makeConnection( 4, 0, 3 ); // envelope 0 to vca
	// patch.makeConnection( 3, 0, 5 ); // vca 0 to filter
	// patch.makeConnection( 5, 0, 6 ); // filter 0 to delay
	// patch.makeConnection( 5, 0, 8 ); // filter 0 to output
	// patch.makeConnection( 6, 0, 8 ); // delay 0 to output
});