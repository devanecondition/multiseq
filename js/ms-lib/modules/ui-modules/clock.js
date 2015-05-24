define([
	'Module',
	'lodash'
], function(
	Module,
	_
) {

	var Clock = function( element ) {

		Module.call( this, 'clock', element );

		this.active = false;
		this.tempo  = 250;
		this.$tempo = this.renderKnob({
			knobLabel    : 'BPM',
			knobFunction : this.adjustTempo,
			extraParams  : { min: 20, max: 350 },
			knobValue    : 240
		});
		//Add Listeners...
		this.$module
			.on( 'click', '.seq-toggle', _.bind( this.toggleClock, this ));
    };

	Clock.prototype = Object.create( Module.prototype );
	Clock.prototype.constructor = Module;

	Clock.prototype.getInnerHtml = function() {
		return (
			'<label>Clock</label>' +
			'<p>Play/Stop</p>' +
			'<div class="seq-toggle button play"></div>'			
		);
	};

	Clock.prototype.toggleClock = function( e ) {
		if ( this.active ) {
			this.active = false;
			$( e.target ).removeClass( 'stop' ).addClass( 'play' );
		} else {
			this.active = true;
			$( e.target ).removeClass( 'play' ).addClass( 'stop' );
			this.runClock();
		}
	};

	Clock.prototype.runClock = function() {
		if ( this.active ) {
			_.each( this.firstOutlet, function( module ) {
				module.gate.call( module );
			});
			setTimeout( _.bind( this.runClock, this ), this.tempo );
		}
	};

	Clock.prototype.adjustTempo = function( newTempo ) {
		this.tempo = 60000 / newTempo;
	};

	return Clock;
});