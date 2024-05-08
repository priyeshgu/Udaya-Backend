const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'resume-uploads/'); // Directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename files to avoid conflicts
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
