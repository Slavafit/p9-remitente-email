const { Schema, model } = require('mongoose');

const MailListModel = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  entries: [{
    contact: { type: Schema.Types.ObjectId, ref: 'Contact' },
    isSent: { type: Boolean, default: false },
    response: { type: String, default: '' }
  }]
});

module.exports = model('MailList', MailListModel);


