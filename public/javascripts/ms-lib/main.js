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
			// $.ajax({
			// 	url: '/api/patch/get/55abfc8e8d97051100000001',
			// 	method: 'GET',
			// 	dataType: 'json',
			// 	success: function( preset ) {

			// 		if ( !preset ) { return; }
					

				var preset = {
					// 'basic' : {
						modules: [
							{ 
								id:'11435428700971',
								name: 'clock',
								tempo: 240
							},			
							{
								id:1,
								name: 'sequencer',
								direction:'forward'
							},
							{
								id:2,
								name: 'vco',
								waveType: 'sawtooth',
								fineTune: 0,
								octave: 2
							},
							{
								id:3,
								name: 'vca',
								peakAmplitude: 50
							},
							{
								id:4,
								name: 'envelope-generator',
								attackTime: 0,
								releaseTime: 23
							},
							{
								id:5,
								name: 'filter',
								frequency: 2600,
								resonance: 62
							},
							{
								id:6,
								name: 'delay',
								delayTime: 38,
								feedback: 40
							},
							// {
							// 	name: 'lfo',
							// 	frequency: 80,
							// 	waveType: 'triangle'
							// },
							{
								id:7,
								name: 'output'
							},
							{
								id:8,
								name: 'keyboard'
							}
						],
						connections : [
							{
								source: 'outlet_1_0',
					  			target: 'inlet_2_0'
					  		},
							{
								source: 'outlet_11435428700971_0',
					  			target: 'inlet_1_1'
					  		},
							{
								source: 'outlet_1_1',
					  			target: 'inlet_4_0'
					  		},
							{
								source: 'outlet_8_0',
					  			target: 'inlet_2_0'
					  		},
							{
								source: 'outlet_8_1',
					  			target: 'inlet_4_0'
					  		},
							{
								source: 'outlet_2_0',
					  			target: 'inlet_3_0'
					  		},
							{
								source: 'outlet_4_0',
					  			target: 'inlet_3_0'
					  		},
							{
								source: 'outlet_3_0',
					  			target: 'inlet_5_0'
					  		},
							{
								source: 'outlet_5_0',
					  			target: 'inlet_7_0'
					  		},
							{
								source: 'outlet_5_0',
					  			target: 'inlet_6_0'
					  		},
							{
								source: 'outlet_6_0',
					  			target: 'inlet_7_0'
					  		},
							{
								source: 'outlet_8_0',
					  			target: 'inlet_1_0'
					  		},
							{
								source: 'outlet_8_1',
					  			target: 'inlet_1_1'
					  		}		  		
						]
					// }
				};


				// preset.modules = JSON.parse( preset.modules );
				// preset.connections = JSON.parse( preset.connections );
				synth.initialize( preset );
				// },
				// error: function( r ) {
				// 	console.log('no preset found', r );
				// }
			// });
		}
	};

	jsPlumb.ready( synth.getPreset );
});