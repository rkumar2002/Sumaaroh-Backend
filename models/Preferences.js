const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
  guestSize: { type: String, default: '' }, 
  venues: { type: [String], default: [] },  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
});

const Preferences = mongoose.model('Preferences', preferencesSchema);

module.exports = Preferences;