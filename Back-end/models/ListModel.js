const { Schema, model} = require('mongoose')

const ListModel = new Schema({
    provincia: [{type: String }],
    entidad: [{type: String }],
    categoria: [{type: String }],
    provincia: [{type: String }],
    territorio: [{type: String }],
})

module.exports = model('List', ListModel)