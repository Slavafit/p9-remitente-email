const { Schema, model } = require('mongoose');

const MailListEntrySchema = new Schema({
  contact: { type: Schema.Types.ObjectId, ref: 'Contact' },
  isSent: { type: Boolean, default: false },
  response: { type: String, }
});

const MailListModel = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  entries: [MailListEntrySchema]
});

module.exports = model('MailList', MailListModel);

