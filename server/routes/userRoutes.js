const express = require("express");
const router = express.Router();
const {register,login,getCurrentUser}=require("../controllers/userController");
const {protect} = require("../middleware/authMiddleware")

router.post("/register",register);
router.post("/login",login);
router.get("/me",protect,getCurrentUser);

module.exports = router;