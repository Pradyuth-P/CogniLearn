const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// GET /api/sessions — Return all sessions, newest first
router.get('/', async (req, res) => {
    try {
        const sessions = await Session.find().sort({ createdAt: -1 });
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// POST /api/sessions — Save a new session
router.post('/', async (req, res) => {
    try {
        const { studentId, mode, triggers, timeSpent, score } = req.body;
        const session = new Session({ studentId, mode, triggers, timeSpent, score });
        const saved = await session.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: 'Validation Error', error: err.message });
    }
});

module.exports = router;
