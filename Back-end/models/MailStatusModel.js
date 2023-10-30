const { Schema, model } = require('mongoose');

const MailStatusModel = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  contact: { type: Schema.Types.ObjectId, ref: 'Contact' },
  status: { type: String, enum: ['Enviada', 'No enviada'], default: 'Sin enviar' },
  response: { type: String, enum: ['Voy', 'No puedo'] },
});

module.exports = model('MailingStatus', MailStatusModel);
