define([
	'UiModule',
	'delete-module-btn',
	'key',
	'lodash'
], function(
	UiModule,
	DeleteModuleBtn,
	Key,
	_
) {

	var Keyboard = function( params ) {

		UiModule.call( this, params );

		this.active = false;

		this.render();

		this.$module.on( 'mouseleave', _.bind( this.deactivate, this ));
	};

	Keyboard.prototype = Object.create( UiModule.prototype );
	Keyboard.prototype.constructor = Keyboard;

	Keyboard.prototype.getJacks = function() {
		return [
			{
				name   : 'Pitch Out',
				jackId : 0,
				type   : 'outlet'
			},
			{
				name   : 'Gate Out',
				jackId : 1,
				type   : 'outlet'
			}
		];
	};

	Keyboard.prototype.render = function() {

		var $deleteBtn = new DeleteModuleBtn( this, this.patch ).getElem();

		this.$module.html( '' );
		
		if ( this.state.getMode() === 'edit' ) {
			this.$module.append( $deleteBtn );
		}

		var notes = [
			'f0', 'gb0', 'g0', 'ab0', 'a0', 'bb0', 'b0', 'c1', 'db1', 'd1', 'eb1', 'e1',
			'f1', 'gb1', 'g1', 'ab1', 'a1', 'bb1', 'b1', 'c2', 'db2', 'd2', 'eb2', 'e2' 
		];

		_.each( notes, _.bind( function( note ) {
			var key = new Key( note, this );
			this.$module.append( key.getKey() );
		}, this ));

		this.renderJacks();

		return this;
	};

	Keyboard.prototype.activate = function() {
		this.active = true;
	};

	Keyboard.prototype.deactivate = function() {
		this.active = false;
	};

	return Keyboard;
});