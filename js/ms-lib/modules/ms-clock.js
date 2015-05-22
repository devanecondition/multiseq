define([
	'Module'
], function(
	Module
) {

	var Clock = function( context, element ) {
		Module.call( this, 'clock', element );
    };

	Clock.prototype = Object.create( Module.prototype );
	Clock.prototype.constructor = Module;

	Clock.prototype.getInnerHtml = function() {
		return (
			'<label>Clock</label>' +
			'<p>BPM</p>' +
			'<input type="text" />'
		);
	};

	return Clock;
});