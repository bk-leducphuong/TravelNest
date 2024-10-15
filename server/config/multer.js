const multer = require('multer');

// Configure storage
const storage = multer.memoryStorage(); // Store file in memory for processing
const upload = multer({ storage: storage });

module.exports = upload;