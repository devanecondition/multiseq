define([
	'Module',
	'ms-note-frequencies',
	'ms-state',
	'lodash'
], function(
	Module,
	Notes,
	State,
	_
) {

	var Sequencer = function( element ) {

		Module.call( this, 'sequencer', element );

		this.seqId = State.sequencers.length;
		this.note  = 'a4';

		// Save Sequencer in state...
		State.sequencers.push({
			seqNotes   : [ Notes['a3'], Notes['c3'], Notes['d3'], Notes['b3'], Notes['g3'], Notes['a3'] ],
			recordMode : false,
			waveType   : 'sine',
			attack     : 0.1,
			release    : 0.1,
			noteIndex  : 0
		});

		//Add Listeners...
		this.$module
			.on( 'click', '.seq-toggle', _.bind( this.toggleSequencer, this ))
			.on( 'click', '.seq-record', _.bind( this.recordSequence, this ));
    };

	Sequencer.prototype = Object.create( Module.prototype );
	Sequencer.prototype.constructor = Module;

    Sequencer.prototype.getInnerHtml = function() {
    	return (
    		'<label>Sequencer</label>' +
			'<div class="seq-toggle button">Start</div>' +
			'<div class="seq-record button">Record</div>'
		);
    };

    Sequencer.prototype.getSequencer = function() {
    	return State.sequencers[ this.seqId ];
    };

	Sequencer.prototype.setFrequency = function( note ) {

		var thisSequencer = State.sequencers[ this.seqId ];
		
		if ( thisSequencer.recordMode && note ) {
			this.note = note;
		}
	};

	Sequencer.prototype.trigger = function() {

		var thisSequencer = State.sequencers[ this.seqId ];

		if ( thisSequencer.recordMode ) {
			thisSequencer.seqNotes.push( this.note );
		}
	};

	Sequencer.prototype.recordSequence = function( e ) {

		var thisSequencer = State.sequencers[ this.seqId ];

		if ( thisSequencer.recordMode ) {
			thisSequencer.recordMode = false;
			$( e.target ).html('Record');
		} else {
			State.sequenceRunning = false;
			thisSequencer.seqNotes = [];
			thisSequencer.recordMode = true;
			$( e.target ).html('off');
		}
	};

	Sequencer.prototype.toggleSequencer = function( e ) {
		if ( State.sequenceRunning ) {
			State.sequenceRunning = false;
			State.noteIndex = 0;
			$( e.target ).html('Play');
		} else {
			State.sequenceRunning = true;
			$( e.target ).html('Stop');
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

	return Sequencer;
});