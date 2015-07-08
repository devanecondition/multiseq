define([
	'lodash'
], function(
	_
) {

	var modules     = [],
		connections = [],
		mode        = 'edit',
		listeners   = {},
		State       = function( preset ) {
			if ( preset ) {
				// this.toggleMode( mode );
			}
		},
		proto       = State.prototype;

	proto.getState = function() {
		return {
			modules     : modules,
			connections : connections
		}
	};

	proto.addListener = function( setting, fn, context ) {
		listeners[ setting ] = listeners[ setting ] || [];
		listeners[ setting ].push({
			setting : setting,
			fn      : fn,
			context : context
		});
		return this;
	};

	proto.updateListeners = function( setting ) {
		if ( listeners[ setting ] ) {
			_.each( listeners[ setting ], function( listener ) {
				listener.fn.call( listener.context );
			});
		};
	};

	proto.getMode = function() {
		return mode;
	};

	proto.toggleMode = function() {
		mode = ( mode === 'performance' ) ? 'edit' : 'performance';
		this.updateListeners( 'mode' );
	};

	proto.getModule = function( moduleId ) {
		return _.findWhere( modules, { id: moduleId } );
	};

	proto.addModule = function( module ) {
		modules.push( module.getStateData() );
		return module;
	};

	proto.removeModule = function( moduleId ) {

		var index = _.findIndex( modules, { id: moduleId } );

		if ( index > -1 ) {
			modules.splice( index, 1 );
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
		connections.push( connection );
	};

	proto.removeConnection = function( connectionId ) {

		var index = _.findIndex( connections, { id: connectionId } );

		if ( index > -1 ) {
			connections.splice( index, 1 );
		}
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

	proto.destroy = function() {
		modules = [];
		connections = [];
		mode = 'edit';
	};

	return State;
});