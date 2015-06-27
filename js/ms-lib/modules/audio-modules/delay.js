define([
	'AudioModule'
], function(
	AudioModule
) {

	var Delay = function( params ) {

		AudioModule.call( this, params, {
			delayTime : params.settings.delayTime || 0,
			feedback  : params.settings.feedback || 0
		});

		this.delay    = params.context.createDelay();
		this.feedback = params.context.createGain();
		this.input    = this.delay;
		this.output   = this.delay;

		this.setTime( this.stateData.delayTime );
    	this.setFeedback( this.stateData.feedback );

		this.delay.connect( this.feedback );
    	this.feedback.connect( this.delay );

		this.$time = this.renderKnob({
			knobLabel    : 'Time',
			knobFunction : this.setTime,
			extraParams  : { min: 0, max: 100},
			knobValue    : this.stateData.delayTime
		});

		this.$feedback = this.renderKnob({
			knobLabel    : 'FeedBack',
			knobFunction : this.setFeedback,
			extraParams  : { min: 0, max: 100 },
			knobValue    : this.stateData.feedback
		});
    };

	Delay.prototype = Object.create( AudioModule.prototype );
	Delay.prototype.constructor = Delay;

	Delay.prototype.getJacks = function() {
		return [
			{
				jackId : 0,
				type   : 'inlet'
			},
			{
				jackId : 0,
				type   : 'outlet'
			}
		];
	};

	Delay.prototype.getInnerHtml = function() {
		return (
			'<label>Delay</label>'
		);
	};

    Delay.prototype.setTime = function( time ) {
		this.delay.delayTime.value = time * 0.01;
		this.setModuleProperty( 'delayTime', time );
    };

    Delay.prototype.setFeedback = function( feedback ) {
    	this.feedback.gain.value = feedback * 0.01;
    	this.setModuleProperty( 'feedback', feedback );
    };

	return Delay;
});