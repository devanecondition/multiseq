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

		this.patch.state.addListener( 'mode', this.render, this );

		// add menu to wrapper div
		this.$container = $( '<div class="menu-container">' + this.getHtml() + '</div>' )
		this.$top = this.$container.find('.top');

		this.$container
			.on( 'click', '.add', this.toggleDrawer.bind( this ) )
			.on( 'click', '.patch-mode', this.toggleMode.bind( this ) )
			.on( 'click', '.new-patch', this.createNewPatch.bind( this ) );

		this.$drawer = this.$container.find( '.drawer' );

		// populate drawer items
		this.createDrawerLinks();
	};

	Menu.prototype.render = function() {
		this.getMenuOptions();
	};

	Menu.prototype.getElem = function() {
		return this.$container;
	};

	Menu.prototype.getHtml = function() {
		var mode = this.patch.state.getMode();
		return (			
			'<div class="top">' + 
				'<a href="#" class="patch-mode">' + mode + ' Mode</a>' +
			'</div>' +
			'<div class="drawer"></div>'
		);
	};

	Menu.prototype.getMenuOptions = function() {

		var mode = this.patch.state.getMode(),
			editHtml = ( this.patch.state.getMode() === 'edit' ) ? (
				'<a href="#" class="add">+</a>' +
				'<div class="spacer">|</div>' +
				'<a href="#" class="new-patch">New Patch</a>'
			) : '';

		this.$top.html(
			editHtml +
			'<a href="#" class="patch-mode">' + mode + ' Mode</a>'
		);
	};

	Menu.prototype.toggleDrawer = function( e ) {

		e.preventDefault();

		this.$drawer.toggleClass( 'showing' );
	};

	Menu.prototype.toggleMode = function( e ) {
		e.preventDefault();
		this.patch.state.toggleMode();
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

	Menu.prototype.destroyPatch = function() {
		_.each( this.patch.getModules(), function( module ) {
			this.patch.removeModule( module.stateData.id );
		}, this );

		$('.patch-container').remove();

		this.patch.disableConnections();
		this.patch.state.destroy();
		delete this.patch;
	};

	Menu.prototype.createNewPatch = function( e ) {

		e.preventDefault();

		var $wrapper      = $( '<div></div>' ),
			plumbInstance = jsPlumb.getInstance({ // create instance to draw module lines
		        Endpoint : [ "Dot", { radius: 8 } ]
		    });

	    this.destroyPatch();

		this.patch = new Patch( plumbInstance );
		this.$container.find('.drawer').empty();
		this.createDrawerLinks();

		this.patch.enableShortcuts(); // Add listeners for "n" and "delete" keys

		// Render...
		$wrapper.append( this.patch.getElem() );

		$('body').append( $wrapper.children() );

		// Post-render functions...
		plumbInstance.setContainer( this.patch.getElem() );
		this.patch.render();		
	};

	return Menu;
});