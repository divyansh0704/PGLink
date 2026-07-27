const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createComment,getCommentsByPgId,updateComment,deleteComment,} = require("../controllers/commentController");


router.get("/pg/:pgId", getCommentsByPgId);
router.post("/pg/:pgId",protect,  createComment);
router.put("/:id",protect,  updateComment);
router.delete("/:id",protect, deleteComment);

module.exports = router;