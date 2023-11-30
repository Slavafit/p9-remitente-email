const { Schema, model} = require('mongoose')

const UserModel = new Schema({
    username: {type: String, unique: true, required: true },
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    roles: [{type: String, ref: 'Role'}],
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String },
    resetPasswordToken: {type: String },
    resetPasswordExpires: {type: String },
})

module.exports = model('User', UserModel)