define([

], function(

) {

	var Jack = function( params ) {
		this.jackId   = params.jackId;
		this.type     = params.type;
		this.moduleId = params.moduleId;
		this.$jack    = $( this.getHtml() ).data( params );
	};

	Jack.prototype.getHtml = function() {
		return(
			'<div class="button jack ' + this.type + ' ' + this.type + '_' + this.jackId + '">' +
				'<div></div>' +
			'</div>'
		);
	};

	Jack.prototype.getElem = function() {
		return this.$jack;
	};

	return Jack;
});