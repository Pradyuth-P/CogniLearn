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
app.get('/', (req, res) => res.json({ status: 'CogniLearn API running', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));

// Connect to MongoDB then start server
console.log(`🔗 Connecting to MongoDB...`);
console.log(`   URI: ${MONGO_URI.replace(/:([^:@]{1,}?)@/, ':****@')}`);

mongoose
    .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log(`✅ MongoDB connected successfully!`);
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 Faculty dashboard API: http://localhost:${PORT}/api/sessions`);
        });
    })
    .catch((err) => {
        console.error('\n❌ MongoDB Connection Failed!');
        console.error(`   Reason: ${err.message}\n`);
        console.error('─────────────────────────────────────────────────────────');
        console.error('  HOW TO FIX — Use MongoDB Atlas (Free Cloud DB):');
        console.error('  1. Go to https://www.mongodb.com/atlas and sign up free');
        console.error('  2. Create a free M0 cluster');
        console.error('  3. Click Connect → Drivers → copy the connection string');
        console.error('  4. Open server/.env and paste it as:');
        console.error('     MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/cognilearn');
        console.error('  5. Restart the server');
        console.error('─────────────────────────────────────────────────────────\n');
        process.exit(1);
    });
