define([
	'note-frequencies',
	'knob'
], function(
	Notes,
	knob
) {

	var Module = function() {
		this.$module      = this.render();
		this.outlets      = {};
	};

	Module.prototype.getId = function() {
		return this.id;
	};

	// Create a module $wrapper
	Module.prototype.getHtml = function() {
		return '<div class="module ' + this.name + '">' + this.getInnerHtml() + '</div>';
	};

	Module.prototype.getInnerHtml = function() {
		return '';
	};

	Module.prototype.render = function() {
		return $( this.getHtml() ).appendTo( this.element );
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

	return Module;
});