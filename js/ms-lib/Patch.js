define([
	'lodash'
], function(
	_
) {

	// private variables...
	var modules = {},
		context = new AudioContext();

	var Patch = function() {
		this.$container = $( '<div class="patch-container"></div>' );
		this.outletModuleId = null;
		this.outletId       = null;
		this.inletModuleId  = null;
		this.inletId        = null;
	};

	Patch.prototype.getElem = function() {
		return this.$container;
	};

	Patch.prototype.getModules = function() {
		return modules;
	};

	Patch.prototype.setJack = function( type, outletModuleId, outletId ) {
console.log('setjack', type, outletModuleId, outletId)
		this[ type + 'ModuleId' ] = outletModuleId;
		this[ type + 'Id' ]       = outletId;
		this.attemptConnection();
	};

	Patch.prototype.addModule = function( Module ) {

		var id = _.size( modules );

		modules[ id ] = new Module( this, id, context, this.$container );

		this.$container.append( modules[ id ].getElem() );
	};

	Patch.prototype.removeModule = function( moduleId ) {

		var module = modules[ moduleId ];

		// disconnect any patch cords
		module.disconnect();
		// remove from DOM
		module.getElem().remove();
		// delete instance from memory
		delete modules[ moduleId ];
	};

	Patch.prototype.attemptConnection = function() {
console.log('ac', this.outletModuleId, this.outletId, this.inletModuleId);
		if ( this.outletModuleId !== null && this.outletId !== null && this.inletModuleId !== null ) {
			this.makeConnection();
		};
	};

	Patch.prototype.makeConnection = function() {
console.log(modules[ this.outletModuleId ], this.outletId, modules[ this.inletModuleId ] );
		modules[ this.outletModuleId ].connect( this.outletId, modules[ this.inletModuleId ] );
		this.outletModuleId = null;
		this.outletId       = null;
		this.inletModuleId  = null;
		this.inletId        = null;
	};

	return Patch;
});