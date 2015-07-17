define([
	'modules',
	'state',
	'empty',
	'cable',
	'jsPlumb',
	'lodash'
], function(
	Modules,
	State,
	Empty,
	Cable,
	jsPlumb,
	_
) {

	// Safari fix...
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	// private variables...
	var modules             = {},
		connections         = {},
		moduleIdIncrementor = 0,
		context             = new AudioContext();

	var Patch = function( instance, preset ) {
		this.instance     = instance;
		this.$container   = $( this.getHtml() );
		this.$doc         = $( document );
		this.preset       = preset;
		this.state        = new State( preset );
		this.rendered     = ( typeof preset === 'undefined' );
		this.connectionId = 0;

window.State = this.state;

		this.instance.registerConnectionTypes({
			"selected":{
				paintStyle      : { strokeStyle:"#333", lineWidth : 5 },
				hoverPaintStyle : { lineWidth: 6 },
				cssClass        : "connector-selected"
			} 
		});

		this.enableConnections();

	    if ( this.preset ) {
	    	this.buildPresetModules();
	    }

	    this.state.addListener( 'mode', this.render, this );
	};

	Patch.prototype.createConnections = function ( connectInfo ) {
		_.each( this.preset.connections, function( connection ) {
			var cable = this.createConnection( connection );
			this.storeConnection( connection, cable );				
		}, this );
		this.rendered = true;
	};

	Patch.prototype.createConnection = function ( connectInfo ) {
		return new Cable({
			id          : this.connectionId++,
			instance    : this.getPlumbInstance(),
			patch       : this,
			state       : this.state,
			connectInfo : connectInfo
		});
	};

	Patch.prototype.getIdInfo = function( id ) {

		var idArray  = id.split('_'),
			jackType = idArray[0],
			moduleId = idArray[1],
			jackId;

		idArray.splice( 0, 2 );

		jackId = idArray.join('_');

		return {
			type     : jackType,
			moduleId : moduleId,
			jackId   : jackId
		};
	};

	Patch.prototype.render = function() {

		var mode = this.state.getMode();

		this.renderModules();

		if ( !this.rendered ) {
			this.createConnections();
		}

		if ( mode === 'edit' ) {
			_.each( connections, function( connection ) {
				connection.connect();
			});
			this.enableConnections();
		} else {
			this.disableConnections();
		}
	};

	Patch.prototype.getHtml = function() {
		return (
			'<div class="patch-container"></div>'
		);
	};

	Patch.prototype.getElem = function() {
		return this.$container;
	};

	Patch.prototype.enableConnections = function() {
		this.instance.bind( 'connection', this.onConnection.bind( this ) );
	    this.instance.bind( 'click', this.onCableSelected.bind( this ) );
	};

	Patch.prototype.storeConnection = function( connection, cable ) {

		var connection = connection || {},
			sourceData = this.getIdInfo( connection.sourceId || connection.source ),
			targetData = this.getIdInfo( connection.targetId || connection.target );

		connections[ cable.id ] = cable;
		modules[ sourceData.moduleId ].storeConnection( cable.id );
		modules[ targetData.moduleId ].storeConnection( cable.id );
		modules[ sourceData.moduleId ].connect( sourceData.jackId, modules[ targetData.moduleId ] );
	};

	Patch.prototype.onConnection = function( connection ) {

		var cable = this.createConnection({
				source     : connection.sourceId,
				target     : connection.targetId,
				connection : connection.connection
			});

		this.storeConnection( connection, cable );
	};

	Patch.prototype.disableConnections = function() {
		this.instance.reset();
	    this.instance.unbind( 'connection' );
	    this.instance.unbind( 'click' );
	};

	Patch.prototype.getModules = function() {
		return modules;
	};

	Patch.prototype.getPlumbInstance = function() {
		return this.instance;
	};

    Patch.prototype.buildPresetModules = function() {

    	_.each( this.preset.modules, function( module ) {
    		this.addModule({
    			id     : module.id,
    			name   : module.name,
    			module : Modules[ module.name ]
    		}, module );
    	}, this );
    };

	Patch.prototype.addModule = function( moduleObj, settings ) {

		var timeStamp = new Date().getTime(),
			id        = moduleObj.id || ++moduleIdIncrementor + timeStamp;

		modules[ id ] = new moduleObj.module({
			name       : moduleObj.name,
			patch      : this,
			id         : id,
			context    : context,
			$container : this.$container,
			settings   : settings || {}
		});

		this.state.addModule( modules[ id ] );

		this.renderModule( id );
	};

	Patch.prototype.renderModules = function( id ) {
		_.each( modules, function( module ) {
			module
			.render()
			.postRenderFunction();
		});
	};

	Patch.prototype.renderModule = function( id ) {

		var $module = modules[ id ].getElem();

		this.$container.append( $module );

		if ( this.rendered ) {
			modules[ id ].postRenderFunction();
		}
	};

	Patch.prototype.removeModule = function( moduleId ) {

		var module = modules[ moduleId ];

		// disconnect any patch cords
		_.each( module.getConnectionIds(), function( id ) {
			this.detachConnection( connections[id].cableId );
		}, this );

		// remove from DOM
		module.getElem().remove();
		this.instance.repaintEverything();
		// delete instance from memory
		delete modules[ moduleId ];
		this.state.removeModule( moduleId );
	};

	Patch.prototype.detachConnection = function( connectionId ) {

		var connection = _.findWhere( connections, { 'cableId': connectionId } );

		if ( connection ) {

			var source = ( connection ) ? modules[ connection.getConnectInfo().source.split('_')[1] ] : null;
			connection.disconnect();
			source.disconnect();
			this.state.removeConnection( connectionId );
			delete connections[ connectionId ];
		}
	};

	Patch.prototype.onCableSelected = function( cable ) {

		// delete key removes patch cord
		var onDeleteKeydown = function( e ) {
        	if ( e.which == 8 ) {
	        	e.preventDefault();
        		this.detachConnection( cable.id );
        		this.$doc.off( 'keydown', onDeleteKeydown );
        	}
        }.bind( this );

        cable.toggleType( 'selected' );

        this.$doc.on( 'keydown', onDeleteKeydown );
	};

	Patch.prototype.shortcuts = function( e ) {
		switch( e.which ) {
			case 8:
				e.preventDefault();
				break;
			case 78:
				var $module = this.addModule({
					name   : 'empty',
					module : Empty
				});
				break;
		};
	};

	Patch.prototype.enableShortcuts = function() {
		this.$doc.on( 'keydown', this.shortcuts.bind( this ) );
	};

	Patch.prototype.disableShortcuts = function() {
		this.$doc.off( 'keydown' );
	};

	return Patch;
});