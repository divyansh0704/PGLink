const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const {createCollege,getAllColleges,deleteCollege} = require("../controllers/collegeController");



router.post("/create",protect,createCollege)
router.get("/",getAllColleges)
router.delete("/:id",deleteCollege)

module.exports = router;