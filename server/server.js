require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const sessionsRouter = require('./routes/sessions');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cognilearn';

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

// Routes
app.use('/api/sessions', sessionsRouter);

// Health check
app.get('/', (req, res) => res.json({
    status: 'CogniLearn API running',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    version: '3.5',
}));

// ── Always start the Express server first ──
app.listen(PORT, () => {
    console.log(`\n🚀 CogniLearn API server started`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`   Sessions endpoint: http://localhost:${PORT}/api/sessions\n`);
});

// ── Then attempt MongoDB connection (non-blocking) ──
console.log(`🔗 Connecting to MongoDB...`);
console.log(`   URI: ${MONGO_URI.replace(/:([^:@]{1,}?)@/, ':****@')}\n`);

mongoose
    .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log(`✅ MongoDB connected — sessions will persist to database.`);
    })
    .catch((err) => {
        console.warn(`\n⚠️  MongoDB connection failed: ${err.message}`);
        console.warn(`   Running in OFFLINE mode — sessions won't persist.`);
        console.warn(`   To enable persistence, update MONGO_URI in server/.env\n`);
        console.warn(`   Get a free DB: https://www.mongodb.com/atlas\n`);
        // Do NOT exit — keep the server running for the health-check endpoint
    });
