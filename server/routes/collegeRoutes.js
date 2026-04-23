const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const {createCollege,getAllColleges} = require("../controllers/collegeController");



router.post("/create",protect,createCollege)
router.get("/",getAllColleges)

module.exports = router;