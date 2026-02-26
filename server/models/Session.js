const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  studentId:  { type: String, required: true },
  mode:       { type: String, default: 'Neurotypical' },
  triggers:   { type: String, default: 'None' },
  timeSpent:  { type: String, default: '0m 0s' },
  score:      { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
