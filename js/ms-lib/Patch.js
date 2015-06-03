define([
	'jsPlumb',
	'lodash'
], function(
	jsPlumb,
	_
) {

	// private variables...
	var modules             = {},
		moduleIdIncrementor = 0,
		context             = new AudioContext();

	var Patch = function( instance ) {

		this.instance   = instance;
		this.$container = $( this.getHtml() );

	    this.instance.bind( 'connection', this.makeConnection.bind( this ) );

	    this.instance.bind("click", function ( cable ) {
	        console.log( 'cable clicked', cable );
	    });
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
		        filter           : ".jack.outlet div",
		        anchor           : "Continuous",
		        connector        : [ "StateMachine", { curviness: 80 } ],
		        connectorStyle   : {
		            strokeStyle  : "#444",
		            lineWidth    : 4,
		            outlineColor : "transparent",
		            outlineWidth : 4
		        }
		    });
	    }

	    if ( $inlets.length ) {
		    instance.makeTarget( $inlets, {
		        dropOptions: { hoverClass: "dragHover" },
		        anchor: "Continuous",
		        allowLoopback: true
		    });
	    }
    };

	Patch.prototype.addModule = function( Module ) {

		var id = moduleIdIncrementor++;

		modules[ id ] = new Module( this, id, context, this.$container );

		this.$container.append( modules[ id ].getElem() );
		this.addJackListeners( modules[ id ].getElem() );
	};

	Patch.prototype.removeModule = function( moduleId ) {

		var module = modules[ moduleId ];

		// disconnect any patch cords
		module.disconnect();
		// remove from DOM
		module.getElem().remove();
		// delete instance from memory
		delete modules[ moduleId ];
	};

	Patch.prototype.makeConnection = function ( info ) {

		var connection = info.connection,
			sourceData = $( connection.source ).data(),
			targetData = $( connection.target ).data();

        console.log( 'make connection called', sourceData, targetData );
        modules[ sourceData.moduleId ].connect( sourceData.jackId, modules[ targetData.moduleId ] );
	};

	return Patch;
});