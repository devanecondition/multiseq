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

	var presets = {
		'basic' : {
			modules: [
				{ 
					id:'1_1435428700971',
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
					source: 'outlet_1_1435428700971_0',
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
		}
	};

	jsPlumb.ready( function() {

		var $wrapper      = $( '<div></div>' ),
			plumbInstance = jsPlumb.getInstance({ // create instance to draw module lines
		        Endpoint : [ "Dot", { radius: 8 } ]
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
		plumbInstance.setContainer( patch.getElem() );
		patch.postRenderFunction();

	});
});