/**
 * Created by Oluwatosin on 11/17/2015.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var MenSchema = mongoose.model('Mentor', new Schema({
    ment_id:      {type: Number, required: true},
    firstName:    {type: String, required: true},
    lastName:     {type: String, required: true},
    email:        {type: String, required: true, unique: true},
    cellPhone:    {type: String, required: true},
    major:        {type: String, required: true},
    sex:          {type: String, required: true},
    preference:   {type: String, required: true},
    assigned:     {type: Boolean, default: false},
    mentee_id:    {type: Array, unique: false}
    

})
);

var AddEvent = mongoose.model('event', new Schema({
    eventName:      {type: String, required: true},
    startDate:    {type: Date, required: true},
    endDate:     {type: Date, required: true},
    startTime:        {type: String, required: true, unique: true},
    endTime:    {type: String, required: true},
    venue:        {type: String, required: true},
    eventDetail:          {type: String, required: true}
    

})
);

/**
 * Our User model.
 *
 * This is how we create, edit, delete, and retrieve user accounts via MongoDB.
 */





/**
 * Our User model.
 *
 * This is how we create, edit, delete, and retrieve user accounts via MongoDB.
 */

var Host = mongoose.model('Hostfamily', new Schema({
   // id:           ObjectId,
    firstName:    { type: String, required: true},
    lastName:     { type: String, required: true },
    email:        { type: String, required: true, unique: true },
    address:     { type: String, required: true },
    mobileNo:     { type: Number, required: true },
    preference:     { type: String, required: true },
    data:         Object,
}));

/**
 * Our Mentor model*
 */
/**
module.exports.Mentor = mongoose.model('Mentor', new Schema({
    id:           ObjectId,
    firstName:    { type: String, required: '{PATH} is required.' },
    lastName:     { type: String, required: '{PATH} is required.' },
    email:        { type: String, required: '{PATH} is required.', unique: true },
    password:     { type: String, required: '{PATH} is required.' },
    data:         Object,
}));
*/

module.exports = {
    MenSchema: MenSchema,
    Host: Host,
    AddEvent: AddEvent,
}