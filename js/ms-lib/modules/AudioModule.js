define([
	'Module',
	'lodash'
], function(
	Module,
	_
) {

	var AudioModule = function () {
		Module.call( this );
	};

	AudioModule.prototype = Object.create( Module.prototype );
	AudioModule.prototype.constructor = Module;

	AudioModule.prototype.connect = function( nodeOutputIndex, node ) {
console.log(this,node)
		if ( node.hasOwnProperty( 'input' ) ) {
			this.output.connect( node.input );
		} else {
			this.output.connect( node );
		};
	};

	AudioModule.prototype.disconnect = function( nodeOutputIndex, node ) {
		this.input.disconnect();
		this.output.disconnect();
	};

	return AudioModule;
});