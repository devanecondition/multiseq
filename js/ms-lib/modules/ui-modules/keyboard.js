define([
	'UiModule',
	'key',
	'lodash'
], function(
	UiModule,
	Key,
	_
) {

	var Keyboard = function ( element ) {

		UiModule.call( this, 'keyboard-container', element );

		this.active = false;

		this.createKeys();

		this.$module.on( 'mouseleave', _.bind( this.deactivate, this ));
	};

	Keyboard.prototype = Object.create( UiModule.prototype );
	Keyboard.prototype.constructor = UiModule;

	Keyboard.prototype.createKeys = function() {

		var notes = [
			'f0', 'gb0', 'g0', 'ab0', 'a0', 'bb0', 'b0', 'c1', 'db1', 'd1', 'eb1', 'e1',
			'f1', 'gb1', 'g1', 'ab1', 'a1', 'bb1', 'b1', 'c2', 'db2', 'd2', 'eb2', 'e2' 
		];

		_.each( notes, _.bind( function( note ) {
			var key = new Key( note, this );
		}, this ));
	};

	Keyboard.prototype.activate = function() {
		this.active = true;
	};

	Keyboard.prototype.deactivate = function() {
		this.active = false;
	};

	return Keyboard;
});