const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const postJoinFormData = (req, res) => {
  // store into hotels and rooms table in database
  const {joinFormData} = req.body;
  console.log(joinFormData);
  // return hotel_id and room_id if success
  res.json({
    hotel_id: "", // hotel_id,
    room_id:"", // room_id
    success: true,
    message: "Join form submitted successfully"
  })
};

const postPhotos = async (req, res) => {
  // const {hotel_id} = req.body;
  const hotel_id = "60";
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }
    // Ensure the uploads directory exists
    const uploadDir = "../server/public/uploads/hotels";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.mkdir(path.join(uploadDir, hotel_id), { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating directory:", err);
        res.status(500).json({
          success: false,
          message: "Server error while creating directory",
        });
      }
    });

    // Process each uploaded image
    const processedFiles = await Promise.all(
      req.files.map(async (file) => {
        const timestamp = new Date()
          .toISOString()
          .replace(/[^a-zA-Z0-9_\\-]/g, "-");
        const avifFilename = `${timestamp}.avif`;
        const outputPath = path.join(uploadDir, hotel_id, avifFilename); // http://localhost:3000/public/uploads/hotels/<hotel_id>/1665854966123-myimage.avif

        // Convert image to AVIF using sharp
        await sharp(file.buffer)
          .avif({ quality: 50 }) // Adjust quality as needed
          .toFile(outputPath);

        return {
          originalName: file.originalname,
          avifName: avifFilename,
          path: `/uploads/${hotel_id}/${avifFilename}`,
        };
      })
    );

    res.json({
      success: true,
      message: "Files uploaded and converted successfully",
      files: processedFiles,
    });
  } catch (error) {
    console.error("Error processing images:", error);
    res.status(500).json({
      success: false,
      message: "Server error while processing images",
    });
  }
};

module.exports = { postJoinFormData, postPhotos };
