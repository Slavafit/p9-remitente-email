const { Schema, model} = require('mongoose')

const EventModel = new Schema({
    name: {type: String, unique: true, required: true },
    description: {type: String },
    image: {type: String },
    startDate: { type: Date },
    adress: { type: String },
    used: { type: Boolean, default: false }
})

module.exports = model('Event', EventModel)