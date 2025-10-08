const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const router = require('./routes/routes');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('./models/index'); // Pastikan ini mendaftarkan semua model

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.set('trust proxy', 1);
app.use((req, res, next) => {
  if (!req.secure) return res.redirect(301, 'https://' + req.headers.host + req.originalUrl);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/word/itinerary/:filename', (req, res) => {

    const { filename } = req.params;

    // cegah akses file ilegal (security)
    if (filename.includes('..')) return res.status(400).send('Invalid filename');

    // ✅ sesuaikan dengan lokasi file kamu: public/word/itinerary
    const filePath = path.join(__dirname, 'public/word/itinerary', filename);

    // cek apakah file ada
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    console.log(filePath);
    // otomatis memicu download di browser
    res.download(filePath, filename, err => {
        if (err) {
            console.error('Download error:', err);
            res.status(500).send('Error while downloading file.');
        }
    });
});

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
