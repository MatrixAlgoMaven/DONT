const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    time: { type: String, required: true },
    frequency: { type: String, enum: ['daily', 'weekly', 'as-needed'], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Medication', medicationSchema);