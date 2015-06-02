define([
	'UiModule',
	'note-frequencies',
	'state',
	'lodash'
], function(
	UiModule,
	Notes,
	State,
	_
) {

	var Sequencer = function( patch, id, context, element ) {

		this.name      = 'sequencer';
		this.patch     = patch;
		this.id        = id;
		this.context   = context;
		this.element   = element;
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

		UiModule.call( this, 'sequencer', element );

		//Add Listeners...
		this.$module
			.on( 'click', '.seq-record', _.bind( this.recordSequence, this ))
			.on( 'click', '.direction', _.bind( this.setDirection, this ))
			.on( 'click', '.rest', _.bind( this.addRest, this ))
			.on( 'click', '.undo', _.bind( this.removeLastNote, this ));
    };

	Sequencer.prototype = Object.create( UiModule.prototype );
	Sequencer.prototype.constructor = Sequencer;

	Sequencer.prototype.getJacks = function() {
		return [
			{
				jackId : 0,
				type   : 'inlet'
			},
			{
				jackId : 1,
				type   : 'inlet'
			},
			{
				jackId : 0,
				type   : 'outlet'
			},
			{
				jackId : 1,
				type   : 'outlet'
			}
		];
	};

    Sequencer.prototype.getInnerHtml = function() {
    	return (
    		'<label>Sequencer</label>' +
    		'<p>Record</p>' +
			'<div class="seq-record button record"></div>' +
			'<p>Direction</p>' +
			'<a href="#" data-direction="backward" class="direction backward"></a>' +
			'<a href="#" data-direction="random" class="direction random"></a>' +
			'<a href="#" data-direction="forward" class="direction forward active"></a>' +
			'<p>Sequence</p>' +
			'<a href="#" data-direction="forward" class="rest text">Skip Note</a>' +
			'<a href="#" data-direction="forward" class="undo text">Undo</a>'
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

    Sequencer.prototype.addRest = function( e ) {

    	e.preventDefault();

    	this.note = 0; //
    	this.trigger();
    };
    Sequencer.prototype.removeLastNote = function( e ) {

    	e.preventDefault();

		var thisSequencer = State.sequencers[ this.seqId ];

		if ( thisSequencer.recordMode ) {
			thisSequencer.seqNotes.pop();
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