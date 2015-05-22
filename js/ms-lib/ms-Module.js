define([
	'ms-note-frequencies',
], function(
	Notes
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

    Module.prototype.renderKnob = function( label, knobFunction, extraParams, knobValue ) {

		var knobSettings = {
			fgColor     : "#999",
			inputColor  : '#666',
			width       : 150,
			height      : 150,
			angleOffset : -125,
			angleArc    : 250,
			change      : _.bind( knobFunction, this )
		};

		knobValue   = ( typeof knobValue !== 'undefined' ) ? knobValue : 10;
		extraParams = extraParams || {};

		knobSettings = $.extend( {}, knobSettings, extraParams );

		$( '<p>' + label + '</p>' ).appendTo( this.$module );

    	return $( '<input type="text" value="' + knobValue + '" class="dial">' ).knob( knobSettings ).appendTo( this.$module );
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