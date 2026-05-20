const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const {createRequest,getRequestsByUser} = require("../controllers/requestController");

router.post("/create",protect,createRequest);
router.get("/my-requests",protect,getRequestsByUser)

module.exports = router;