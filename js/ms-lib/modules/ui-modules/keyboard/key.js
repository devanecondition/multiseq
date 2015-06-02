define([
	'note-frequencies',
], function(
	Notes
) {

	var Key = function( note, keyboard ) {
		this.note     = note;
		this.keyboard = keyboard;
		this.$key     = $( this.getHtml() );

		this.$key
			.on( 'mousedown',  _.bind( this.onButtonPressed, this ))
			.on( 'mouseup',    _.bind( this.onButtonReleased, this ))
			.on( 'mouseenter', _.bind( this.onButtonSlideEnter, this ))
			.on( 'mouseleave', _.bind( this.onButtonSlideLeave, this ));
	};

	Key.prototype.getHtml = function() {
		if ( this.note.length === 2 ) {
        	return '<div class="key"></div>';
    	} else {
        	return (
        		'<div class="key-container">' +
            		'<div class="key black"></div>' +
        		'</div>'
    		);
		}
	};

	Key.prototype.getKey = function() {
		return this.$key;
	};

	Key.prototype.onButtonPressed = function( e ) {
		e.preventDefault();

		this.keyboard.activate();
		$( e.target ).addClass( 'pressed' );
		this.keyboard.playNote( Notes[ this.note ] );
	};

	Key.prototype.onButtonReleased = function( e ) {
		e.preventDefault();
		if ( this.keyboard.active ) {
			this.keyboard.deactivate();
			$( e.target ).removeClass( 'pressed' );
		}
	};	

	Key.prototype.onButtonSlideEnter = function( e ) {
		if ( this.keyboard.active ) {
			$( e.target ).addClass( 'pressed' );
			this.keyboard.playNote( Notes[ this.note ] );
		}
	};	

	Key.prototype.onButtonSlideLeave = function( e ) {
		e.preventDefault();
		$( e.target ).removeClass( 'pressed' );
	};	

	return Key;
});