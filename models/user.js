const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
// const passport = require('passport');

const UserSchema = new Schema({
    
email: {
    type: String,
    require: true,
    unique: true
}

});


UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);