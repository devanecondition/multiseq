define([
	'ms-note-frequencies',
	'ms-state',
	'lodash'
], function(
	Notes,
	State,
	_
) {

	var Sequencer = function() {

		// Save Sequencer in state...
		this.seqId     = State.sequencers.length;
		this.frequency = 440;
		this.$button   = $( '<button>Start</button>' ).appendTo('body');
		this.$rec      = $( '<button>Record</button>' ).appendTo('body');

		State.sequencers.push({
			seqNotes   : ['a3','c3','d3','b3','g3','a3'],
			recordMode : false,
			waveType   : 'sine',
			attack     : 0.1,
			release    : 0.1,
			noteIndex  : 0
		});

		//Add Listeners...
		this.$button.on( 'click', _.bind( this.toggleSequencer, this ));
		this.$rec.on( 'click', _.bind( this.recordSequence, this ));
    };

    Sequencer.prototype.getSequencer = function() {
    	return State.sequencers[ this.seqId ];
    };

	Sequencer.prototype.setFrequency = function( frequency ) {

		var thisSequencer = State.sequencers[ this.seqId ];
		
		if ( thisSequencer.recordMode && frequency ) {
			this.frequency = frequency;
		}
	};

	Sequencer.prototype.trigger = function() {

		var thisSequencer = State.sequencers[ this.seqId ];

		if ( thisSequencer.recordMode ) {
			thisSequencer.seqNotes.push( this.frequency );
		}
	};

	Sequencer.prototype.recordSequence = function() {

		var thisSequencer = State.sequencers[ this.seqId ];

		if ( thisSequencer.recordMode ) {
			thisSequencer.recordMode = false;
			this.$rec.html('Record');
		} else {
			State.sequenceRunning = false;
			thisSequencer.seqNotes = [];
			thisSequencer.recordMode = true;
			this.$rec.html('off');
		}
	};

	Sequencer.prototype.toggleSequencer = function() {
		if ( State.sequenceRunning ) {
			State.sequenceRunning = false;
			State.noteIndex = 0;
			this.$button.html('Play');
		} else {
			State.sequenceRunning = true;
			this.$button.html('Stop');
			this.playSequence();
		}
	};

	Sequencer.prototype.playSequence = function() {

		var notes = this.getSequencer().seqNotes,
			index = State.noteIndex % notes.length;

		this.playNote( notes[ index ] );

		State.noteIndex++;

		if ( State.sequenceRunning ) {
			setTimeout( _.bind( this.playSequence, this ), 250 );
		}
	};

	Sequencer.prototype.playNote = function( note ) {
		//try {
			this.firstOutlet.setFrequency.call( this.firstOutlet, note );
			this.secondOutlet.trigger.call( this.secondOutlet );
		//} catch(e) {}
	};

	Sequencer.prototype.connect = function( outlet, component ) {
		// outputs frequency
		if ( outlet === 0 ) {
			this.firstOutlet = component;
		}
		if ( outlet === 1 ) {
			this.secondOutlet = component;
		}		
	};	

	return Sequencer;
});