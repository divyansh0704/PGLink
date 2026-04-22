const express = require("express");
const router = express.Router();
const {register,login,getCurrentUser, updateUser,updateProfile}=require("../controllers/userController");
const {protect} = require("../middleware/authMiddleware")

router.post("/register",register);
router.post("/login",login);
router.get("/me",protect,getCurrentUser);
router.put("/update",protect,updateUser);
router.put("/updateprofile",protect,updateProfile)

module.exports = router;