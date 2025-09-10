const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createPG, getPGById, getAllPGs, getPGByOwner, deletePG, updatePG, unlockedPG, allPGs, limited } = require("../controllers/pgController");
const multer = require('multer');
const path = require("path");
const { storage } = require("../utils/cloudinary");

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null,Date.now()+path.extname(file.originalname));
//     },
// })

const upload = multer({
    storage,
    limits: { fileSize: 15 * 1024 * 1024 }
});

router.post("/", protect, upload.single('photo'), createPG);
router.get("/", getAllPGs);
router.get("/my-pgs", protect, getPGByOwner);
router.get('/unlocked', protect, unlockedPG);

router.get('/limited', protect, limited)
router.get('/all', protect, allPGs)

router.delete("/:id", protect, deletePG);
router.get("/:id", protect, getPGById);
router.put("/:id", protect, updatePG);



module.exports = router;