define([
	'modules',
	'Module',
	'jquery',
	'jquery-ui'
], function(
	modules,
	Module,
	$
) {

	var Empty = function( patch, id ) {

		this.stateData = {
			id    : id,
			name  : 'empty'
		}

		this.patch      = patch;
		this.moduleList = this.getModuleList();

		Module.call( this );

		var that = this;

		//Add Listeners...
		this.$module
			.on( 'input', 'input', this.preventShortcutInput.bind( this ) )
			.on( 'focus', 'input', this.autoCompleteInput.bind( this ) )
			.on( 'focusout', 'input', this.onInputFocusOut.bind( this ) );
    };

	Empty.prototype = Object.create( Module.prototype );
	Empty.prototype.constructor = Empty;

	Empty.prototype.getInnerHtml = function() {
		return ( '<input class="mod-name" type="text" />' );
	};	

	Empty.prototype.getModuleList = function() {

		var moduleList = [];

		_.each( modules, function( module, moduleName ) {
			moduleList.push( moduleName );
		});

		return moduleList;
	};

	Empty.prototype.preventShortcutInput = function( e ) {
		$( e.target ).val('');
		this.$module.off( 'input', 'input' );
	};

	Empty.prototype.autoCompleteInput = function( e ) {
		$( e.target ).autocomplete({
			source   : this.moduleList,
			appendTo : this.$module,
			messages : {
			    noResults: '',
			    results: function() {}
			},
		 	select   : function( event, ui ) {
				this.patch.removeModule( this.getId() );
		 		this.patch.addModule( modules[ ui.item.value ] );
		 		this.patch.enableShortcuts();
		 	}.bind( this )
		});
	};

	Empty.prototype.onInputFocusOut = function( e ) {
		this.patch.removeModule( this.getId() );
		this.patch.enableShortcuts();
	};

	Empty.prototype.postRenderFunction = function() {
		this.$module.find( 'input' ).focus();
		this.patch.disableShortcuts();
	};

	return Empty;
});