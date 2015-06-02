define([

], function(

) {

	var Jack = function( params ) {
		this.jackId = params.jackId;
		this.type   = params.type;
		this.Module = params.Module;
		this.Patch  = params.Patch;
		this.$jack  = $( this.getHtml() )
			.on( 'click', this.onClick.bind( this ));
	};

	Jack.prototype.getHtml = function() {
		return(
			'<div class="button jack ' + this.type + ' ' + this.type + '_' + this.jackId + '"></div>'
		);
	};

	Jack.prototype.getElem = function() {
		return this.$jack;
	};

	Jack.prototype.onClick = function( e ) {

		e.preventDefault();

		var moduleId = this.Module.getId();

		this.Patch.setJack( this.type, moduleId, this.jackId );

		console.log( moduleId, this.jackId, this.Patch );
	};

	return Jack;
});