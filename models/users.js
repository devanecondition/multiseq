var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
    user_name: String,
    email: String,
    password: String,
    member_since: Date
});

module.exports = mongoose.model( 'Users', UserSchema );