const { Schema, model} = require('mongoose')

const ContactModel = new Schema({
    nombre: {type: String, required: true },
    cargo: {type: String },
    entidad: {type: String },
    categoria: {type: String, ref: 'Subcategoria'},
    provincia: {type: String },
    territorio: {type: String },
    email: {type: String, unique: true, required: true},
    telefono: [{type: String }]
})

module.exports = model('Contact', ContactModel)