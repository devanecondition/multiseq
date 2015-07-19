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

	var synth = {

		initialize : function( preset ) {

			var $wrapper      = $( '<div></div>' ),
				plumbInstance = jsPlumb.getInstance({ // create instance to draw module lines
			        Endpoint : [ "Dot", { radius: 8 } ]
			    }),
				patch         = new Patch( plumbInstance, preset ), // Create a new patch...
				menu          = new Menu( patch );  // Build top menu...

			patch.enableShortcuts(); // Add listeners for "n" and "delete" keys

			// Render...
			$wrapper
				.append( menu.getElem() )
				.append( patch.getElem() );

			$('body').html( $wrapper.children() );

			// Post-render functions...
			plumbInstance.setContainer( patch.getElem() );
			patch.render();		
		},

		getPreset : function() {		
			$.ajax({
				url: '/api/patch/get/55abfc8e8d97051100000001',
				method: 'GET',
				dataType: 'json',
				success: function( preset ) {

					if ( !preset ) { return; }
					
					preset.modules = JSON.parse( preset.modules );
					preset.connections = JSON.parse( preset.connections );
					synth.initialize( preset );
				},
				error: function( r ) {
					console.log('no preset found', r );
				}
			});
		}
	};

	jsPlumb.ready( synth.getPreset );
});