const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const postJoinFormData = (req, res) => {};

const postPhotos = async (req, res) => {
  // const {hotel_id} = req.body;
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      size: file.size
    }));

    res.json({
      success: true,
      files: uploadedFiles,
      message: 'Files uploaded successfully'
    });
    // // Ensure the uploads directory exists
    // const uploadDir = path.join(__dirname, 'public/uploads');
    // if (!fs.existsSync(uploadDir)) {
    //     fs.mkdirSync(uploadDir, { recursive: true });
    // }

    // // Check if files are uploaded
    // if (!req.files || req.files.length === 0) {
    //     return res.status(400).json({success: false, message: 'No files uploaded' });
    // }

    // // Process each uploaded image
    // const processedFiles = await Promise.all(req.files.map(async (file) => {
    //     const avifFilename = `${Date.now()}-${req.file.originalname.split('.')[0]}.avif`;
    //     const outputPath = path.join(uploadDir, hotel_id, avifFilename); // http://localhost:3000/public/uploads/<hotel_id>/1665854966123-myimage.avif

    //     // Convert image to AVIF using sharp
    //     await sharp(file.buffer)
    //         .avif({ quality: 50 }) // Adjust quality as needed
    //         .toFile(outputPath);

    //     return {
    //         originalName: file.originalname,
    //         avifName: avifFilename,
    //         path: `/uploads/${hotel_id}/${avifFilename}`
    //     };
    // }));

    // res.json({success: true, message: 'Files uploaded and converted successfully', files: processedFiles });
  } catch (error) {
    console.error("Error processing images:", error);
    res.status(500).json({
      success: false,
      message: "Server error while processing images",
    });
  }
};

module.exports = { postJoinFormData, postPhotos };
