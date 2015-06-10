define([
	'empty',
	'jsPlumb',
	'lodash'
], function(
	Empty,
	jsPlumb,
	_
) {

	// private variables...
	var modules             = {},
		moduleIdIncrementor = 0,
		connections         = {},
		context             = new AudioContext();

	var Patch = function( instance ) {

		this.instance   = instance;
		this.$container = $( this.getHtml() );
		this.$doc       = $( document );

		this.instance.registerConnectionTypes({
			"selected":{
				paintStyle      : { strokeStyle:"#333", lineWidth : 5 },
				hoverPaintStyle : { lineWidth: 6 },
				cssClass        : "connector-selected"
			} 
		});

	    this.instance.bind( 'connection', this.makeConnection.bind( this ) );
	    this.instance.bind("click", this.onCableSelected.bind( this ) );
	};

	Patch.prototype.getHtml = function() {
		return (
			'<div class="patch-container"></div>'
		);
	};

	Patch.prototype.getElem = function() {
		return this.$container;
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

	Patch.prototype.addModule = function( Module ) {

		var id       = moduleIdIncrementor++,
			$module;

		modules[ id ] = new Module( this, id, context, this.$container );

		$module = modules[ id ].getElem();

		this.$container.append( $module );
		this.addJackListeners( $module );
		modules[ id ].postRenderFunction();
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
	};

	Patch.prototype.detachConnection = function( connectionId ) {

		var connection = connections[ connectionId ],
			source     = ( connection ) ? modules[ connection.source.moduleId ] : null;

		if ( connection ) {
			this.instance.detach( connection.data );
			source.disconnect();
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
				var $module = this.addModule( Empty );
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