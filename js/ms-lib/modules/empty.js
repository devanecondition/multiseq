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

		var moduleList = this.getModuleList();

		this.patch = patch;
		this.id    = id;

		Module.call( this );

		this.patch.disableShortcuts();
		var that = this;
		//Add Listeners...
		this.$module
			.on( 'focus', 'input', function( e ) {
				$( e.target ).autocomplete({
					source: moduleList,
				 	select: function( event, ui ) {
						that.patch.removeModule( that.getId() );
				 		that.patch.addModule( modules[ ui.item.value ] );
				 		that.patch.enableShortcuts();
				 	}
				});
			});
    };

	Empty.prototype = Object.create( Module.prototype );
	Empty.prototype.constructor = Empty;

	Empty.prototype.getInnerHtml = function() {
		return (
			'<input type="text" autofocus />'
		);
	};

	Empty.prototype.getModuleList = function() {

		var moduleList = [];

		_.each( modules, function( module, moduleName ) {
			moduleList.push( moduleName );
		});

		return moduleList;
	};

	return Empty;
});