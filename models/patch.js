var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var PatchSchema = new Schema({
    name: String,
    user_id: Number,
    user_name: String,
    modules: String,
    connections: String
});

module.exports = mongoose.model( 'Patch', PatchSchema );