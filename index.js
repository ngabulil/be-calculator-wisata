const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const router = require('./routes/routes');
const cors = require('cors');
require("./models/index");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

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

app.use('/api', router);
