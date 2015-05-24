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
		this.note      = 'a1';
		this.noteIndex = 0;
		this.direction = 'forward';

		// Save Sequencer in state...
		State.sequencers.push({
			seqNotes   : [ Notes['a1'], Notes['c1'], Notes['d1'], Notes['b1'], Notes['g1'], Notes['a1'] ],
			recordMode : false,
			waveType   : 'sine',
			attack     : 0.1,
			release    : 0.1
		});

		//Add Listeners...
		this.$module
			.on( 'click', '.seq-record', _.bind( this.recordSequence, this ))
			.on( 'click', 'a', _.bind( this.setDirection, this ));
    };

	Sequencer.prototype = Object.create( Module.prototype );
	Sequencer.prototype.constructor = Module;

    Sequencer.prototype.getInnerHtml = function() {
    	return (
    		'<label>Sequencer</label>' +
    		'<p>Record</p>' +
			'<div class="seq-record button record"></div>' +
			'<p>Direction</p>' +
			'<a href="#" data-direction="backward" class="direction backward"></a>' +
			'<a href="#" data-direction="random" class="direction random"></a>' +
			'<a href="#" data-direction="forward" class="direction forward active"></a>'
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

		var notes     = this.getSequencer().seqNotes,
			seqLength = notes.length,
			modIndex  = Math.abs( this.noteIndex.mod )
			index     = this.noteIndex % seqLength;

		switch( this.direction ) {
			case 'forward' :
				this.playNote( notes[ index ] );
				this.noteIndex++;
				break;
			case 'backward' :
				this.playNote( notes[ index ] );
				this.noteIndex = ( this.noteIndex <= 1 ) ? seqLength : this.noteIndex - 1;
				break;
			case 'random' :
				index = Math.floor( Math.random() * ( seqLength ) );
				this.playNote( notes[ index ] );
				break;
		}
	};

	Sequencer.prototype.setDirection = function( e ) {

		e.preventDefault();

		var $this     = $( e.target ),
			direction = $this.data( 'direction' );

		this.$module.find( '.direction' ).removeClass( 'active' );

		$this.addClass( 'active' );

		this.direction = direction;
	};

	return Sequencer;
});