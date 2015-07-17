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

	Patch.prototype.createConnection = function ( connectInfo ) {
		return new Cable({
			id          : this.connectionId++,
			instance    : this.getPlumbInstance(),
			patch       : this,
			state       : this.state,
			connectInfo : connectInfo
		});
	};

	Patch.prototype.render = function() {

		var mode = this.state.getMode();

		_.each( modules, function( module ) {
			module
			.render()
			.postRenderFunction();
		});

		if ( !this.rendered ) {
			_.each( this.preset.connections, function( connection ) {
				var cable = this.createConnection( connection ),
					sourceData = connection.source.split('_'),
					targetData = connection.target.split('_');

				connections[ cable.id ] = cable;
				modules[ sourceData[1] ].storeConnection( cable.id );
				modules[ targetData[1] ].storeConnection( cable.id );
				modules[ sourceData[1] ].connect( sourceData[2], modules[ targetData[1] ] );
			}, this );

			this.rendered = true;
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

	Patch.prototype.onConnection = function( connection ) {

		var cable = this.createConnection({
				source     : connection.sourceId,
				target     : connection.targetId,
				connection : connection.connection
			}),
			sourceData = connection.sourceId.split('_'),
			targetData = connection.targetId.split('_');

		connections[ cable.id ] = cable;

		modules[ sourceData[1] ].storeConnection( cable.id );
		modules[ targetData[1] ].storeConnection( cable.id );
		modules[ sourceData[1] ].connect( sourceData[2], modules[ targetData[1] ] );
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
			id        = moduleObj.id || ++moduleIdIncrementor + '_' + timeStamp;

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