const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const router = require('./routes/routes');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const auditLogMiddleware = require('./middlewares/logsMiddleware');
require('./models/index'); // Pastikan ini mendaftarkan semua model

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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

// logging middleware
app.use('/api', auditLogMiddleware());

// API routes
app.use('/api', router);

// DB Connection + Sync
sequelize.authenticate()
  .then(() => console.log('✅ Connected to DB'))
  .catch(err => console.error(err));

// Server Listen
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
