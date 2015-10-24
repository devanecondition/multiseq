define([
	'UiModule',
	'note-frequencies',
	'lodash'
], function(
	UiModule,
	Notes,
	_
) {

	var Sequencer = function( params ) {

		UiModule.call( this, params, {
			direction : params.settings.direction || 'forward',
			seqNotes : params.settings.seqNotes || [ Notes['a1'], Notes['d1'], Notes['a1'], Notes['e1'], Notes['a2'], Notes['e1'], Notes['d2'], Notes['a1'], Notes['a2'] ]
		});

		this.note       = 'a1';
		this.noteIndex  = 0;
		this.direction  = this.stateData.direction;
		this.seqNotes   = this.stateData.seqNotes;
		this.recordMode = false;

		//Add Listeners...
		this.$module
			.on( 'click', '.seq-record', this.recordSequence.bind( this ))
			.on( 'click', '.direction', this.setDirection.bind( this ))
			.on( 'click', '.rest', this.addRest.bind( this ))
			.on( 'click', '.undo', this.removeLastNote.bind( this ));
    };

	Sequencer.prototype = Object.create( UiModule.prototype );
	Sequencer.prototype.constructor = Sequencer;

	Sequencer.prototype.getJacks = function() {
		return [
			{
				name   : 'Pitch In',
				jackId : 0,
				type   : 'inlet'
			},
			{
				name   : 'Gate In',
				jackId : 1,
				type   : 'inlet'
			},
			{
				name   : 'Pitch Out',
				jackId : 0,
				type   : 'outlet'
			},
			{
				name   : 'Gate Out',
				jackId : 1,
				type   : 'outlet'
			}
		];
	};

    Sequencer.prototype.getInnerHtml = function() {

    	var direction     = this.stateData.direction,
    		forwardClass  = ( direction === 'forward' ) ? ' active' : '',
    		randomClass   = ( direction === 'random' ) ? ' active' : '',
    		backwardClass = ( direction === 'backward' ) ? ' active' : '';

    	return (
    		'<label>Sequencer</label>' +
    		'<p>Record</p>' +
			'<div class="seq-record button record"></div>' +
			'<p>Direction</p>' +
			'<a href="#" data-direction="backward" class="direction backward' + backwardClass + '"></a>' +
			'<a href="#" data-direction="random" class="direction random' + randomClass + '"></a>' +
			'<a href="#" data-direction="forward" class="direction forward' + forwardClass + '"></a>' +
			'<p>Sequence</p>' +
			'<a href="#" data-direction="forward" class="rest text">Skip Note</a>' +
			'<a href="#" data-direction="forward" class="undo text">Undo</a>'
		);
    };

	Sequencer.prototype.setFrequency = function( note ) {

		if ( this.recordMode && note ) {
			this.note = note;
		}
	};

	Sequencer.prototype.trigger = function() {

		if ( this.recordMode ) {
			this.seqNotes.push( this.note );
			this.setModuleProperty( 'seqNotes', this.seqNotes );
		}
	};

	Sequencer.prototype.recordSequence = function( e ) {

		if ( this.recordMode ) {
			this.recordMode = false;
			$( e.target ).removeClass( 'stop' ).addClass( 'record' );
		} else {
			this.seqNotes = [];
			this.recordMode = true;
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

		if ( this.recordMode ) {
			this.seqNotes.pop();
			this.setModuleProperty( 'seqNotes', this.seqNotes );
		}
    };

	Sequencer.prototype.gate = function() {

		var notes     = this.seqNotes,
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
		this.setModuleProperty( 'direction', direction );
	};

	return Sequencer;
});