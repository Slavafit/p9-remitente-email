const { Schema, model} = require('mongoose')

const SubcategoriaModel = new Schema({
    value: {type: String, unique: true, default: "Other"},   
})

module.exports = model('Subcategoria', SubcategoriaModel)

