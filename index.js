const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const router = require('./routes/routes');
const cors = require('cors');
const path = require('path');
require('./models/index'); // Pastikan ini mendaftarkan semua model

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for PDFs (or other public assets)
app.use('/', express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', router);

// DB Connection + Sync
sequelize.authenticate()
    .then(() => {
        console.log('✅ Connected to DB via Sequelize');
        return sequelize.sync({ alter: true }); // gunakan { force: true } kalau mau reset tabel
    })
    .then(() => {
        console.log('✅ Models synced');
    })
    .catch(err => {
        console.error('❌ Failed to connect to DB:', err.message);
    });

// Server Listen
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
