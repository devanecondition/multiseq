<!DOCTYPE html>
<html>
<head>
    <title>Web Modular</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <link rel="stylesheet" type="text/css" href="css/multi-seq.css">
    <script>

		var context  = new (window.AudioContext || window.webkitAudioContext)();

		var Vco = function() {
			this.osc = context.createOscillator();
			this.osc.type = 'sine';
			this.osc.frequency.value = 10000;
			this.osc.start();

			this.inlets = [
				{
					node: context.createGain(),
					param: 'frequency',
					range: 10000
				}
			];

			for ( var i = 0; i < this.inlets.length; i ++ ) {

				var inlet = this.inlets[i],
					node  = inlet.node;

				node.gain.value = inlet.range;

				node.connect( this.osc[ inlet.param ] );
			}
		};

		var Lfo = function() {
			this.lfo = context.createOscillator();
			this.lfo.type = 'sine';
			this.lfo.frequency.value = 500;
			this.lfo.start();
		}

		Lfo.prototype.connect = function( inletIndex, module ) {
			this.lfo.connect( module.inlets[ inletIndex ].node );
		};		

	
		var vco = new Vco(),
			lfo = new Lfo();

		lfo.connect( 0, vco );
		//vco.osc.connect( context.destination );

    </script>
</head>
<body></body>
</html>