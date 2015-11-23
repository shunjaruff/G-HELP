var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String,
    std_id : Number,
    firstname : String,
    lastname : String,
    program : String,
    semester: Number,
    mobile : Number,
    dob : String,
    sex : String,
    country : String,
    maritalstatus : String,
    preference: String,
    date : Date,
    assigned: {type: Boolean, default: false},
    ment_id: Number,
    assignedfamily: String,
    image: {bin: Buffer, type: String}

});




Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('student', Account);