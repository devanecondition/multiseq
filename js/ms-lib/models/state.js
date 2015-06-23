define([
	'lodash'
], function(
	_
) {

	var State = function( preset ) {
			preset           = preset || {};
			this.modules     = preset.modules || [];
			this.connections = preset.connections || [];
		},
		proto = State.prototype;

	proto.getState = function() {
		return {
			modules     : this.modules,
			connections : this.connections
		}
	};

	proto.getModule = function( moduleId ) {
		return _.findWhere( this.modules, { id: moduleId } );
	};

	proto.addModule = function( module ) {
		this.modules.push( module.getStateData() );
		return module;
	};

	proto.removeModule = function( moduleId ) {

		var index = _.findIndex( this.modules, { id: moduleId } );

		if ( index > -1 ) {
			this.modules.splice( index, 1 );
		}
	};

	proto.setModuleProperty = function( params ) {

		var module = this.getModule( params.id );

		if ( module ) {
			module[ params.property ] = params.value;
		}

		return params.value;
	};

	return State;
});