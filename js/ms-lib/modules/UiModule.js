define([
	'Module',
	'lodash'
], function(
	Module,
	_
) {

	var UiModule = function ( params, settings ) {
		Module.call( this, params, settings );
	};

	UiModule.prototype = Object.create( Module.prototype );
	UiModule.prototype.constructor = UiModule;

	UiModule.prototype.playNote = function( note ) {
		try {
			_.each ( this.outlets[ 0 ], function( module ) {
				module.setFrequency.call( module, note );
			});
			_.each ( this.outlets[ 1 ], function( module ) {
				module.trigger.call( module );
			});
		} catch( e ) {}
	};	

	UiModule.prototype.connect = function( outlet, component ) {
		this.outlets[ outlet ] = this.outlets[ outlet ] || [];
		this.outlets[ outlet ].push( component );
	};

	UiModule.prototype.disconnect = function( outlet, component ) {
		return true;
	};
	return UiModule;
});