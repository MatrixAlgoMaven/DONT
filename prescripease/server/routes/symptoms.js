const express = require('express');
const auth = require('../middleware/auth');
const Symptom = require('../models/Symptom');
const router = express.Router();

// Get all symptoms for user
router.get('/', auth, async (req, res) => {
    try {
        const symptoms = await Symptom.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(symptoms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new symptom
router.post('/', auth, async (req, res) => {
    try {
        const { type, severity, recommendation } = req.body;
        
        const newSymptom = new Symptom({
            userId: req.user.id,
            type,
            severity,
            recommendation
        });
        
        await newSymptom.save();
        res.status(201).json(newSymptom);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;