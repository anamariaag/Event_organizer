const {Schema, model} = require('mongoose');

const reviewSchema = new Schema({
    idPerson: {type: String},
    personUserName: {type: String},
    personPhoto: {type: String},
    idEvent: {type: String},
    comment: {type: String},
    date: {type: Date}
});

module.exports = model('reviews', reviewSchema);