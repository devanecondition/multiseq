define( function( require ) {
	return {
		clock        : require( 'clock' ),
		sequencer    : require( 'sequencer' ),
		vco          : require( 'vco' ),
		vca          : require( 'vca' ),
		envelopeGen  : require( 'envelope-gen' ),
		filter       : require( 'filter' ),
		delay        : require( 'delay' ),
		keyboard     : require( 'keyboard' ),
		output       : require( 'output' )
	};
});