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

	proto.addConnection = function( connection ) {
		this.connections.push( connection );
	};

	proto.save = function() {

		var state = this.getState(),
			data = {
			    name: 'basic',
			    user_id: 0,
			    user_name: 'presets',
			    modules: JSON.stringify( state.modules ),
			    connections: JSON.stringify( state.connections )
			};
		
		$.ajax({
			url: '/api/patch/add',
			method: 'POST',
			data: data,
			dataType: 'json',
			success: function( preset ) {
				preset.modules = JSON.parse( preset.modules );
				preset.connections = JSON.parse( preset.connections );
				initialize( preset );
			},
			error: function( r ) {
				console.log('no preset found', r );
			}
		});		
	};

	return State;
});