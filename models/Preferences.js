const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
  guestSize: { type: String, default: '' }, // Can be a string, or you can modify it to accept numbers, etc.
  venues: { type: [String], default: [] },  // Array of strings
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User
});

const Preferences = mongoose.model('Preferences', preferencesSchema);

module.exports = Preferences;