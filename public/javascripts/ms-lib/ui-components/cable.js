define([

], function(

) {

	var Cable = function( params ) {
		this.id          = params.id;
		this.instance    = params.instance;
		this.patch       = params.patch;
		this.state       = params.state;
		this.connectInfo = params.connectInfo || {};
		this.connection  = params.connectInfo.connection || {};
		this.cableId     = this.connection.id || null;

		this.state.addConnection({
			id     : this.id,
			source : this.connectInfo.source,
			target : this.connectInfo.target
		});
	},

	proto = Cable.prototype;

	proto.connect = function() {

		this.connection = this.instance.connect({
			source: this.connectInfo.source,
			target: this.connectInfo.target
		});

		this.cableId = this.connection.id;

		return this.connection;
	};

	proto.disconnect = function() {
		this.instance.detach( this.connection );
	};

	proto.getConnectInfo = function() {
		return this.connectInfo;
	}

	return Cable;
});