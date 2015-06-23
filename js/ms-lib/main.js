require([
	'menu',
	'Patch',
	'jsPlumb',
	'lodash'
], function(
	Menu,
	Patch,
	jsPlumb,
	_
) {

	// Safari fix...
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	var presets = {
		'basic' : {
			modules: [
				{
					id: 0,
					name: 'clock',
					tempo: 120
				},
				{
					id: 2,
					name: 'delay',
					delayTime: 38,
					feedback: 72
				},
				{
					id: 3,
					name: 'envelope-generator',
					attackTime: 28,
					releaseTime: 5
				},
				{
					id: 4,
					name: 'filter',
					attackTime: 2600,
					releaseTime: 62
				}
			]
		}
	};

	jsPlumb.ready( function() {

		var $wrapper      = $( '<div></div>' ),
			plumbInstance = jsPlumb.getInstance({ // create instance to draw module lines
		        Endpoint  : [ "Dot", { radius: 8 } ]
		    }),
			patch         = new Patch( plumbInstance, presets.basic ), // Create a new patch...
			menu          = new Menu( patch );  // Build top menu...


		patch.enableShortcuts(); // Add listeners for "n" and "delete" keys

		// Render...
		$wrapper
			.append( menu.getElem() )
			.append( patch.getElem() );

		$wrapper.appendTo('body');

		// Post-render functions...
		patch.postRenderFunction();
		plumbInstance.setContainer( patch.getElem() );
	});

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