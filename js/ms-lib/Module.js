define([
	'ms-note-frequencies',
	'knob'
], function(
	Notes,
	knob
) {

	var Module = function( name, element, innerHtml ) {
		this.name         = name || 'empty-module';
		this.element      = element || 'body'; // defines where in the dom to insert module
		this.$module      = this.render();
		this.firstOutlet  = [];
		this.secondOutlet = [];
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

	Module.prototype.playNote = function( note ) {
		//try {
			_.each ( this.firstOutlet, function( module ) {
				module.setFrequency.call( module, note );
			});
			_.each ( this.secondOutlet, function( module ) {
				module.trigger.call( module );
			});
		//} catch(e) {}
	};	

	Module.prototype.connect = function( outlet, component ) {
		// outputs frequency
		if ( outlet === 0 ) {
			this.firstOutlet.push( component );
		}
		if ( outlet === 1 ) {
			this.secondOutlet.push( component );
		}		
	};

	return Module;
});