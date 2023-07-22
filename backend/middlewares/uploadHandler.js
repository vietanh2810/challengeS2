const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder where the KBIS files will be stored on the server
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'kbis-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    },
});

const fileFilter = (req, file, cb) => {
    // Only accept files with certain extensions
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and MS Word files are allowed.'));
    }
};

const upload = multer({ storage, fileFilter }).single('kbis');

module.exports = { upload };
