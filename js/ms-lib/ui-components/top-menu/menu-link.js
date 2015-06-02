define([

], function(

) {

	var MenuLink = function( params ) {
		this.menu       = params.menu,
		this.patch      = params.patch;
		this.moduleName = params.moduleName;
		this.Module     = params.Module;
		this.$link      = $( this.getHtml() )
			.appendTo( params.$container )
			.on( 'click', this.onMenuLinkClick.bind( this ) );
	};

	MenuLink.prototype.getHtml = function() {
		return (
			'<a href="#">' + this.moduleName.replace( /-/g, ' ' ) + '</a>'
		);
	};

	MenuLink.prototype.onMenuLinkClick = function( e ) {

		e.preventDefault();

		this.patch.addModule( this.Module );
		this.menu.toggleDrawer(e);
	};

	return MenuLink;
});