const { Schema, model } = require('mongoose');

const MailListEntrySchema = new Schema({
  contact: { type: Schema.Types.ObjectId, ref: 'Contact' },
  
  status: { type: String, enum: ['Enviada', 'No enviada'], default: 'Sin enviar' },
  response: { type: String, enum: ['Voy', 'No puedo'] }
});

const MailListModel = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  entries: [MailListEntrySchema]
});

module.exports = model('MailList', MailListModel);

