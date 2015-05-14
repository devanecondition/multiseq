define([
	'ms-key',
	'ms-note-frequencies',
	'lodash'
], function(
	Key,
	Notes,
	_
) {

	var Keyboard = function () {
		this.active       = false;
		this.$keyboard    = $( this.render() ).appendTo('body');
		this.octave       = 3;
		this.firstOutlet  = [];
		this.secondOutlet = [];

		this.createKeys();

		this.$keyboard.on( 'mouseleave', _.bind( this.deactivate, this ));
	};

	Keyboard.prototype.render = function() {
		return '<div class="keyboard-container"></div>';
	};

	Keyboard.prototype.createKeys = function() {
		_.each( this.octaveGroupings[ this.octave ], _.bind( function( note ) {
			var key = new Key( note, this );
		}, this ));
	};

	Keyboard.prototype.octaveGroupings = [
		[ 'f0', 'gb0', 'g0', 'ab0', 'a0', 'bb0', 'b0', 'c1', 'db1', 'd1', 'eb1', 'e1', 'f1', 'gb1', 'g1', 'ab1', 'a1', 'bb1', 'b1', 'c2', 'db2', 'd2', 'eb2', 'e2' ],
		[ 'f1', 'gb1', 'g1', 'ab1', 'a1', 'bb1', 'b1', 'c2', 'db2', 'd2', 'eb2', 'e2', 'f2', 'gb2', 'g2', 'ab2', 'a2', 'bb2', 'b2', 'c3', 'db3', 'd3', 'eb3', 'e3' ],
		[ 'f2', 'gb2', 'g2', 'ab2', 'a2', 'bb2', 'b2', 'c3', 'db3', 'd3', 'eb3', 'e3', 'f3', 'gb3', 'g3', 'ab3', 'a3', 'bb3', 'b3', 'c4', 'db4', 'd4', 'eb4', 'e4' ],
		[ 'f3', 'gb3', 'g3', 'ab3', 'a3', 'bb3', 'b3', 'c4', 'db4', 'd4', 'eb4', 'e4', 'f4', 'gb4', 'g4', 'ab4', 'a4', 'bb4', 'b4', 'c5', 'db5', 'd5', 'eb5', 'e5' ]
	];	

	Keyboard.prototype.activate = function() {
		this.active = true;
	};

	Keyboard.prototype.deactivate = function() {
		this.active = false;
	};

	Keyboard.prototype.playNote = function( note ) {
		//try {
			_.each ( this.firstOutlet, function( module ) {
				module.setFrequency.call( module, Notes[ note ] );
			});
			_.each ( this.secondOutlet, function( module ) {
				module.trigger.call( module );
			});
		//} catch(e) {}
	};	

	Keyboard.prototype.connect = function( outlet, component ) {
		// outputs frequency
		if ( outlet === 0 ) {
			this.firstOutlet.push( component );
		}
		if ( outlet === 1 ) {
			this.secondOutlet.push( component );
		}		
	};	

	return Keyboard;
});