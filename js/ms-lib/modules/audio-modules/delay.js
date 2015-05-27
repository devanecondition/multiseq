define([
	'AudioModule'
], function(
	AudioModule
) {

	var Delay = function( context, element ) {

		AudioModule.call( this, 'delay', element );

		this.delay                 = context.createDelay();
		this.delay.delayTime.value = 0;

		this.feedback              = context.createGain();
    	this.feedback.gain.value   = 0;

		this.delay.connect( this.feedback );
    	this.feedback.connect( this.delay );

		this.input                 = this.delay;
		this.output                = this.delay;

		this.$time = this.renderKnob({
			knobLabel    : 'Time',
			knobFunction : this.setTime,
			extraParams  : { min: 0, max: 100},
			knobValue    : 0
		});

		this.$feedback = this.renderKnob({
			knobLabel    : 'FeedBack',
			knobFunction : this.setFeedback,
			extraParams  : { min: 0, max: 100 },
			knobValue    : 0
		});
    };

	Delay.prototype = Object.create( AudioModule.prototype );
	Delay.prototype.constructor = AudioModule;

	Delay.prototype.getInnerHtml = function() {
		return (
			'<label>Delay</label>'
		);
	};

    Delay.prototype.setTime = function( time ) {
		this.delay.delayTime.value = time * 0.01;
    };

    Delay.prototype.setFeedback = function( feedback ) {
    	this.feedback.gain.value = feedback * 0.01;
    };

	return Delay;
});