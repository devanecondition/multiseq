define([
	'modules',
	'state',
	'empty',
	'jsPlumb',
	'lodash'
], function(
	Modules,
	State,
	Empty,
	jsPlumb,
	_
) {

	// Safari fix...
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	// private variables...
	var modules             = {},
		moduleIdIncrementor = 0,
		connections         = {},
		context             = new AudioContext();

	var Patch = function( instance, preset ) {
		this.instance   = instance;
		this.$container = $( this.getHtml() );
		this.$doc       = $( document );
		this.preset     = preset;
		this.state      = new State( preset );
		this.rendered   = ( typeof preset === 'undefined' );

window.State = this.state;

		this.instance.registerConnectionTypes({
			"selected":{
				paintStyle      : { strokeStyle:"#333", lineWidth : 5 },
				hoverPaintStyle : { lineWidth: 6 },
				cssClass        : "connector-selected"
			} 
		});

	    this.instance.bind( 'connection', this.makeConnection.bind( this ) );
	    this.instance.bind( 'click', this.onCableSelected.bind( this ) );

	    if ( this.preset ) {
	    	this.buildPresetModules();
	    }

	    this.state.addListener( 'mode', this.render, this );
	};

	Patch.prototype.render = function() {

		var mode = this.state.getMode();

		_.each( modules, function( module ) {
			module.render();
		});

		if ( mode === 'edit' ) {
			// show connections
		} else {
			_.each( connections, this.hideConnection, this );
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

	Patch.prototype.postRenderFunction = function( $wrapper ) {
		if ( !this.rendered ) {
			_.each( modules, function( module ) {
				this.addJackListeners( module.getElem() );
				module.postRenderFunction();
			}, this );
			this.rendered = true;
			if ( this.state.getMode() === 'edit' ) {
				_.each( this.preset.connections, this.setConnection, this);
			}
		}
	};

	Patch.prototype.getModules = function() {
		return modules;
	};

	Patch.prototype.getPlumbInstance = function() {
		return this.instance;
	};

	Patch.prototype.addJackListeners = function( $module ) {

		var $inlets  = $module.find( '.inlet' ),
			$outlets = $module.find( '.outlet' ),
			instance = this.getPlumbInstance();

		if ( $outlets.length ) {
		    instance.makeSource( $outlets, {
		        filter              : ".jack.outlet div",
		        anchor              : "Center",
		        connector           : [ "StateMachine", { curviness: 80 } ],
		        connectorStyle      : {
		            strokeStyle     : "#444",
		            lineWidth       : 4,
		            outlineColor    : "transparent",
		            outlineWidth    : 4
		        },
		        connectorClass      : "patch-cord"
		    });
	    }

	    if ( $inlets.length ) {
		    instance.makeTarget( $inlets, {
		        dropOptions: { hoverClass: "dragHover" },
		        anchor: "Center",
		        allowLoopback: false
		    });
	    }
    };

    Patch.prototype.setConnection = function( connection ) {

    	var instance = this.getPlumbInstance(),

			connection = instance.connect({
				source: connection.source,
				target: connection.target
			});

		return connection;
    };

    Patch.prototype.hideConnection = function( connection ) {

    	var instance = this.getPlumbInstance();

		instance.detach( connection.data );
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
			this.addJackListeners( $module );
			modules[ id ].postRenderFunction();
		}
	};

	Patch.prototype.removeModule = function( moduleId ) {

		var module = modules[ moduleId ];

		// disconnect any patch cords
		_.each( module.getConnectionIds(), this.detachConnection.bind( this ) );
		// remove from DOM
		module.getElem().remove();
		this.instance.repaintEverything();
		// delete instance from memory
		delete modules[ moduleId ];
		this.state.removeModule( moduleId );
	};

	Patch.prototype.detachConnection = function( connectionId ) {

		var connection = connections[ connectionId ],
			source     = ( connection ) ? modules[ connection.source.moduleId ] : null;

		if ( connection ) {
			this.instance.detach( connection.data );
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

	Patch.prototype.addConnection = function( connection ) {
		connections[ connection.data.id ] = connection;
	};

	Patch.prototype.makeConnection = function ( info ) {

		var connection = info.connection,
			sourceData = $( connection.source ).data(),
			targetData = $( connection.target ).data();

		this.addConnection({
			data   : connection,
			source : sourceData,
			target : targetData
		});

		this.state.addConnection({
			id     : connection.id,
			source : info.source.id,
			target : info.target.id
		});
		
		modules[ sourceData.moduleId ].storeConnection( connection.id );
		modules[ targetData.moduleId ].storeConnection( connection.id );
        modules[ sourceData.moduleId ].connect( sourceData.jackId, modules[ targetData.moduleId ] );
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