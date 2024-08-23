const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig"); // Import your Cloudinary config

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cuvette_task_blog_media", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"], // Restrict allowed formats if needed
    transformation: [
      { quality: "auto", crop: "fill" },
      { fetch_format: "auto" },
    ],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
  