define([
	'jack',
	'delete-module-btn',
	'note-frequencies',
	'knob',
	'lodash'
], function(
	Jack,
	DeleteModuleBtn,
	Notes,
	knob,
	_
) {

	var Module = function( params, settings ) {
		this.stateData = {
			id        : params.id,
			name      : params.name || params.settings.name,
		};
		if ( settings ) { _.extend( this.stateData, settings ); }
		this.patch       = params.patch;
		this.state       = params.patch.state;
		this.context     = params.context;
		this.element     = params.element;		
		this.$module     = $( this.getHtml() );
		this.outlets     = {};
		this.jacks       = this.getJacks();
		this.connections = [];
		this.$deleteBtn  = new DeleteModuleBtn( this, this.patch )
			.getElem()
			.appendTo( this.$module );

		this.renderJacks();
	};

	Module.prototype.getStateData = function() {
		return this.stateData;
	};

	Module.prototype.getId = function() {
		return this.stateData.id;
	};

	// Create a module $wrapper
	Module.prototype.getHtml = function() {
		return '<div class="module ' + this.stateData.name + '">' + this.getInnerHtml() + '</div>';
	};

	Module.prototype.storeConnection = function( connection ) {
		this.connections.push( connection );
	};

	Module.prototype.getConnectionIds = function() {
		return this.connections;
	};

	Module.prototype.getJacks = function() {
		return [];
	};

	Module.prototype.getInnerHtml = function() {
		return '';
	};

	Module.prototype.getElem = function() {
		return this.$module;
	};

	Module.prototype.postRenderFunction = function() {
		return true;
	};

    Module.prototype.renderKnob = function( settings ) {

		var knobLabel    = settings.knobLabel || '',
			knobFunction = settings.knobFunction,
			extraParams  = settings.extraParams || {},
			knobValue    = ( typeof settings.knobValue !== 'undefined' ) ? settings.knobValue : 10,
			$elem        = settings.$elem || false,
			knobSettings = {
				fgColor     : "#999",
				inputColor  : '#666',
				width       : 150,
				height      : 150,
				angleOffset : -125,
				angleArc    : 250,
				change      : knobFunction.bind( this )
			};

		knobSettings = $.extend( {}, knobSettings, extraParams );

		if ( knobLabel ) {
			$( '<p>' + knobLabel + '</p>' ).appendTo( this.$module );
		}

		if ( $elem ) {
			return $elem.val( knobValue ).knob( knobSettings );
		} else {
    		return $( '<input type="text" value="' + knobValue + '" class="dial">' ).knob( knobSettings ).appendTo( this.$module );
		}
	};

	Module.prototype.renderJacks = function() {

		var $wrapper = $( '<div class="connections"></div>' );

		_.each( this.jacks, function( jack ) {

			 var $jack = $(
			 	'<div class="jack-wrap">' +
			 		'<p>' + jack.name + '</p>' +
			 	'</div>'
		 	);

			$jack.append( new Jack({
				jackId   : jack.jackId,
				type     : jack.type,
				moduleId : this.getId()
			}).getElem() );

			$wrapper.append( $jack );

		}, this );

		this.$module.append( $wrapper );
	};

	Module.prototype.setModuleProperty = function( property, value ) {
		return this.state.setModuleProperty({
			id       : this.getId(),
			property : property,
			value    : value
		});
	};

	Module.prototype.paramChange = function( param, value ) {
		this.stateData[ param ] = value;
	};

	return Module;
});