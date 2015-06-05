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

	var Module = function() {
		this.$module      = $( this.getHtml() );
		this.outlets      = {};
		this.jacks        = this.getJacks();
		this.connections  = [];
		this.$deleteBtn   = new DeleteModuleBtn( this, this.patch )
			.getElem()
			.appendTo( this.$module );

		this.renderJacks();
	};

	Module.prototype.getId = function() {
		return this.id;
	};

	// Create a module $wrapper
	Module.prototype.getHtml = function() {
		return '<div class="module ' + this.name + '">' + this.getInnerHtml() + '</div>';
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
				change      : _.bind( knobFunction, this )
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

		_.each( this.jacks, function( jack ) {

			jack = new Jack({
				jackId   : jack.jackId,
				type     : jack.type,
				moduleId : this.getId()
			});

			this.$module.append( jack.getElem() )
			//jack.addPlumbListeners();

		}.bind( this ));
	};

	return Module;
});