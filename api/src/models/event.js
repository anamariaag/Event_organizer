const {Schema, model} = require('mongoose');

const eventSchema = new Schema({
    name: {type: String, required:[true, "El nombre del evento es necesario"]},
    description: {type: String},
    location: {type: String},
    date: {type: Date,required:[true, "La fecha del evento es necesaria"]},
    durationHour: {type: Number},
    durationMinute: {type: Number},
    category: {type: String},
    programs: {type: [String]},
    relatedLinks: {type: [String]},
    idOrganizer: {type: String} ,
    idUsers: {type:[String]},
    photos: {type: [String]},
    idUsersCalendar: {type:[String]},
    coordinates:{type: [Number], default: [20.60910958346004, -103.41482190142175]}
});

module.exports = model('events', eventSchema);