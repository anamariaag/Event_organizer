const {Schema, model} = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {values: ["ADMIN", "USER", "ORG"],
    message: '{VALUE} no es un role válido'};



const userSchema = new Schema({
    userName: {type: String, unique:true ,required:[true, "El usuario es necesario"]},
    name: {type: String},
    lastName: {type: String},
    email: {type: String, unique:true ,required:[true, "El correo es necesario"]},
    birthdate: {type: String},
    userType: {type: String, default: 'USER', required:[true], enum: rolesValidos},
    cellphone: {type: String},
    major: {type: String},
    exp: {type: String},
    department: {type: String},
    university: {type: String},
    status: {type: Boolean},
    photo: {type: String},
    password: {type: String, required:true},
    token: {type: String}
});

userSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = model('users', userSchema);