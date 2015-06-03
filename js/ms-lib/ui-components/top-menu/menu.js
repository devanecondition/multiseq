define([
	'menu-link',
	'modules',
	'lodash'
], function(
	menuLink,
	modules,
	_
) {

	var Menu = function( patch ) {

		this.patch = patch;

		// add menu to wrapper div
		this.$container = $( this.getHtml() )
			.on( 'click', '.add', this.toggleDrawer.bind( this ) );

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

	return Menu;
});