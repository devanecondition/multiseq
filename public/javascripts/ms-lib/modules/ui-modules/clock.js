define([
	'UiModule',
	'lodash'
], function(
	UiModule,
	_
) {

	var Clock = function( params ) {

		UiModule.call( this, params, {
			tempo : params.settings.tempo || 250
		});

		this.active = false;

		//Add Listeners...
		this.$module
			.on( 'click', '.seq-toggle', _.bind( this.toggleClock, this ));
    };

	Clock.prototype = Object.create( UiModule.prototype );
	Clock.prototype.constructor = Clock;

	Clock.prototype.getKnobs = function() {
		return [
			{
				knobLabel    : 'BPM',
				knobFunction : this.adjustTempo,
				extraParams  : { min: 20, max: 350 },
				knobValue    : this.stateData.tempo || 250
			}
		];
	};

	Clock.prototype.getJacks = function() {
		return [
			{
				name   : 'Gate Out',
				jackId : 0,
				type   : 'outlet'
			}
		];
	};

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
			_.each( this.outlets[ 0 ], function( module ) {
				module.gate.call( module );
			});
			setTimeout( _.bind( this.runClock, this ), 60000 / this.stateData.tempo );
		}
	};

	Clock.prototype.adjustTempo = function( newTempo ) {
		this.stateData.tempo = this.setModuleProperty( 'tempo', newTempo );
	};

	return Clock;
});