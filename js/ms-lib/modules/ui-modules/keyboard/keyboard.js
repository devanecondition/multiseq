define([
	'UiModule',
	'key',
	'lodash'
], function(
	UiModule,
	Key,
	_
) {

	var Keyboard = function( patch, id, context, element ) {

		this.name    = 'keyboard';
		this.patch   = patch;
		this.id      = id;
		this.context = context;
		this.element = element;
		this.active  = false;

		UiModule.call( this );

		this.createKeys();

		this.$module.on( 'mouseleave', _.bind( this.deactivate, this ));
	};

	Keyboard.prototype = Object.create( UiModule.prototype );
	Keyboard.prototype.constructor = Keyboard;

	Keyboard.prototype.getJacks = function() {
		return [
			{
				jackId : 0,
				type   : 'outlet'
			},
			{
				jackId : 1,
				type   : 'outlet'
			}
		];
	};

	Keyboard.prototype.createKeys = function() {

		var notes = [
			'f0', 'gb0', 'g0', 'ab0', 'a0', 'bb0', 'b0', 'c1', 'db1', 'd1', 'eb1', 'e1',
			'f1', 'gb1', 'g1', 'ab1', 'a1', 'bb1', 'b1', 'c2', 'db2', 'd2', 'eb2', 'e2' 
		];

		_.each( notes, _.bind( function( note ) {
			var key = new Key( note, this );
			this.$module.append( key.getKey() );
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