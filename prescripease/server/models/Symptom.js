const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    severity: { type: Number, min: 1, max: 10, required: true },
    recommendation: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Symptom', symptomSchema);