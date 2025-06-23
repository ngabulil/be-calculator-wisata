const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const hotelRoutes = require('./routes/hotel/index');
const router = require('./routes/routes');
require("./models/hotel/index");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

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
