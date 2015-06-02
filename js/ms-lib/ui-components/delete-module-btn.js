define([

], function(

) {

	var DeleteModuleBtn = function( Module, Patch ) {
		this.Module = Module;
		this.Patch  = Patch;
		this.$btn   = $( this.getHtml() )
			.on( 'click', this.onClick.bind( this ));
	};

	DeleteModuleBtn.prototype.getHtml = function() {
		return(
			'<div class="delete button">X</div>'
		);
	};

	DeleteModuleBtn.prototype.getElem = function() {
		return this.$btn;
	};

	DeleteModuleBtn.prototype.onClick = function( e ) {

		e.preventDefault();

		var moduleId = this.Module.getId();

		this.Patch.removeModule( moduleId );
	};

	return DeleteModuleBtn;
});