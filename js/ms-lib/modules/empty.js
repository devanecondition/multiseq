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

		var that = this,
			moduleLoaded = false;

		//Add Listeners...
		this.$module
			.on( 'input', 'input', function( e ) {
				if ( !moduleLoaded ) {
					$( e.target ).val('').off('input');
					moduleLoaded = true;
				}
			})
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
			'<input type="text" />'
		);
	};

	Empty.prototype.getModuleList = function() {

		var moduleList = [];

		_.each( modules, function( module, moduleName ) {
			moduleList.push( moduleName );
		});

		return moduleList;
	};

	Empty.prototype.postRenderFunction = function() {
		this.$module.find( 'input' ).focus();
		this.patch.disableShortcuts();
	};

	return Empty;
});