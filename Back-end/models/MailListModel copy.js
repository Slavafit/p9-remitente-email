const { Schema, model } = require('mongoose');

const MailListEntryModel = new Schema({
  contact: { type: Schema.Types.ObjectId, ref: 'Contact' },
  isSent: { type: Boolean, default: false },
  response: { type: String, }
});

const MailListModel = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  entries: [MailListEntryModel]
});

module.exports = model('MailList', MailListModel, MailListEntryModel);

