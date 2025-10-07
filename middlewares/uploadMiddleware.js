// uploadmiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan folder ada: PDF untuk invoice/itinerary, Word untuk itinerary (Word files)
const ensureFolders = () => {
  const basePdf = path.join(__dirname, '../public/pdf');
  const baseWord = path.join(__dirname, '../public/word');

  // pdf folders
  ['invoice', 'itinerary'].forEach(folder => {
    const dir = path.join(basePdf, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // word folder: public/word/itinerary
  const wordDir = path.join(baseWord, 'itinerary');
  if (!fs.existsSync(wordDir)) fs.mkdirSync(wordDir, { recursive: true });
};
ensureFolders();

// Storage config: simpan sesuai fieldname, itinerary_word -> public/word/itinerary
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'itinerary_word') {
      cb(null, path.join(__dirname, '../public/word', 'itinerary'));
      return;
    }
    // default ke pdf folder (invoice atau itinerary PDF)
    const folder = file.fieldname === 'invoice' ? 'invoice' : 'itinerary';
    cb(null, path.join(__dirname, '../public/pdf', folder));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// fileFilter & limits (sesuaikan lagi kalau perlu)
const fileFilter = (req, file, cb) => {
  const mime = file.mimetype;
  if (file.fieldname === 'invoice' || file.fieldname === 'itinerary') {
    if (mime === 'application/pdf') return cb(null, true);
    return cb(new Error('Only PDF allowed for invoice/itinerary'));
  }
  if (file.fieldname === 'itinerary_word') {
    const allowed = [
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
    ];
    if (allowed.includes(mime)) return cb(null, true);
    return cb(new Error('Only .doc or .docx allowed for itinerary_word'));
  }
  cb(new Error('Unexpected field'));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
