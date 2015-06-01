define([
	'lodash'
], function(
	_
) {

	var Patch = function() {
		this.context    = new AudioContext();
		this.modules    = {};
		this.$container = $( '<div class="synth-container"></div>' ).appendTo( 'body' );
	};

	Patch.prototype.addModule = function( Module ) {

		var id = _.size( this.modules );

		this.modules[ id ] = new Module( this, id, this.context, this.$container );
	};

	Patch.prototype.makeConnection = function( fromModuleId, fromModuleOutlet, toModuleId ) {
		this.modules[ fromModuleId ].connect( fromModuleOutlet, this.modules[ toModuleId ] );
	};

	return Patch;
});