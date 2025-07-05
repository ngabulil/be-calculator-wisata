const multer = require('multer');
const path = require('path');

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'invoice' ? 'invoice' : 'itinerary';
    cb(null, path.join(__dirname, '../public/pdf', folder));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.pdf`);
  }
});

const upload = multer({ storage });

module.exports = upload;
