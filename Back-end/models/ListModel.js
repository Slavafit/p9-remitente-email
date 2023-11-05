const { Schema, model} = require('mongoose')

const ListModel = new Schema({
    cargo: [{type: String }],
    provincia: [{type: String }],
    entidad: [{type: String }],
    categoria: [{type: String, ref: 'Subcategoria'}],
    provincia: [{type: String }],
    territorio: [{type: String }],
})

module.exports = model('List', ListModel)