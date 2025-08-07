const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

require("dotenv").config();

cloudinary.config();

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: `pg_images`,
        public_id: `${Date.now()}`,
        allowed_formats: ['jpg', 'png', 'jpeg'],
    }
});

async function checkCloudinaryConnection() {
    try {
        const result = await cloudinary.api.ping();
        console.log("✅ Cloudinary connected:", result);
    } catch (error) {
        console.error("❌ Cloudinary connection failed:", error.message);
    }
}

checkCloudinaryConnection();

module.exports = {
    cloudinary,
    storage,
}