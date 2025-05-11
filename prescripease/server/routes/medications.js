const express = require('express');
const auth = require('../middleware/auth');
const Medication = require('../models/Medication');
const router = express.Router();

// Get all medications for user
router.get('/', auth, async (req, res) => {
    try {
        const medications = await Medication.find({ userId: req.user.id });
        res.json(medications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new medication
router.post('/', auth, async (req, res) => {
    try {
        const { name, dosage, time, frequency } = req.body;
        
        const newMedication = new Medication({
            userId: req.user.id,
            name,
            dosage,
            time,
            frequency
        });
        
        await newMedication.save();
        res.status(201).json(newMedication);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete medication
router.delete('/:id', auth, async (req, res) => {
    try {
        const medication = await Medication.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        
        if (!medication) return res.status(404).json({ message: 'Medication not found' });
        
        res.json({ message: 'Medication deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;