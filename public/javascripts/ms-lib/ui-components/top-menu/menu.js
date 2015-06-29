define([
	'Patch',
	'menu-link',
	'modules',
	'lodash'
], function(
	Patch,
	menuLink,
	modules,
	_
) {

	var Menu = function( patch ) {

		this.patch = patch;

		// add menu to wrapper div
		this.$container = $( this.getHtml() )
			.on( 'click', '.add', this.toggleDrawer.bind( this ) )
			.on( 'click', '.new-patch', this.createNewPatch.bind( this ) );

		this.$drawer = this.$container.find( '.drawer' );

		// populate drawer items
		this.createDrawerLinks();
	};

	Menu.prototype.getElem = function() {
		return this.$container;
	};

	Menu.prototype.getHtml = function() {
		return (
			'<div class="menu-container">' +
				'<div class="top">' +
					'<a href="#" class="add">+</a>' +
					'<div class="spacer">|</div>' +
					'<a href="#" class="new-patch">New Patch</a>' +
				'</div>' +
				'<div class="drawer"></div>' +
			'</div>'
		);
	};

	Menu.prototype.toggleDrawer = function( e ) {

		e.preventDefault();

		this.$drawer.toggleClass( 'showing' );
	};

	Menu.prototype.createDrawerLinks = function() {
		_.each( modules, function( Module, moduleName ) {
			var link = new menuLink({
				menu       : this,
				$container : this.$drawer,
				patch      : this.patch,
				moduleName : moduleName,
				Module     : Module
			});
		}.bind( this ) );
	};

	Menu.prototype.createNewPatch = function( e ) {

		e.preventDefault();

		_.each( this.patch.getModules(), function( module ) {
			module.disconnect();
		});

		$('.patch-container').remove();

		delete this.patch;

		var $wrapper      = $( '<div></div>' ),
			plumbInstance = jsPlumb.getInstance({ // create instance to draw module lines
		        Endpoint : [ "Dot", { radius: 8 } ]
		    });

		this.patch = new Patch( plumbInstance );

		this.patch.enableShortcuts(); // Add listeners for "n" and "delete" keys

		// Render...
		$wrapper.append( this.patch.getElem() );

		$('body').append( $wrapper.children() );

		// Post-render functions...
		plumbInstance.setContainer( this.patch.getElem() );
		this.patch.postRenderFunction();		
	};

	return Menu;
});