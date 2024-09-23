const {Schema, model} = require('mongoose');

const schema = new Schema({
    name: { type: String},
    filename: { type: String},
    userId: { type: String}
});

module.exports = model('images', schema);