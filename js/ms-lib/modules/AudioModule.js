define([
	'Module',
	'lodash'
], function(
	Module,
	_
) {

	var AudioModule = function ( title, element ) {
		Module.call( this, title, element );
	};

	AudioModule.prototype = Object.create( Module.prototype );
	AudioModule.prototype.constructor = Module;

	AudioModule.prototype.connect = function( node ) {
		if (node.hasOwnProperty('input')) {
			this.output.connect(node.input);
		} else {
			this.output.connect(node);
		};
	};

	return AudioModule;
});