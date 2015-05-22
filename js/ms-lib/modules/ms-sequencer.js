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

		this.seqId     = State.sequencers.length;
		this.note      = 'a4';
		this.noteIndex = 0;

		// Save Sequencer in state...
		State.sequencers.push({
			seqNotes   : [ Notes['a3'], Notes['c3'], Notes['d3'], Notes['b3'], Notes['g3'], Notes['a3'] ],
			recordMode : false,
			waveType   : 'sine',
			attack     : 0.1,
			release    : 0.1
		});

		//Add Listeners...
		this.$module
			.on( 'click', '.seq-record', _.bind( this.recordSequence, this ));
    };

	Sequencer.prototype = Object.create( Module.prototype );
	Sequencer.prototype.constructor = Module;

    Sequencer.prototype.getInnerHtml = function() {
    	return (
    		'<label>Sequencer</label>' +
    		'<p>Record</p>' +
			'<div class="seq-record button record"></div>'
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
			$( e.target ).removeClass( 'stop' ).addClass( 'record' );
		} else {
			thisSequencer.seqNotes = [];
			thisSequencer.recordMode = true;
			$( e.target ).removeClass( 'record' ).addClass( 'stop' );
		}
	};

	Sequencer.prototype.gate = function() {

		var notes = this.getSequencer().seqNotes,
			index = this.noteIndex % notes.length;

		this.playNote( notes[ index ] );

		this.noteIndex++;
	};

	return Sequencer;
});