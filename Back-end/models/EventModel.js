const { Schema, model} = require('mongoose')

const EventModel = new Schema({
    name: {type: String, unique: true, required: true },
    description: {type: String },
    image: {type: String },
    startDate: { type: Date },
    endDate: { type: Date },
})

module.exports = model('Event', EventModel)