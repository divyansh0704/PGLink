const express = require("express");
const router = express.Router();
const {register,login,getCurrentUser, updateUser,updateProfile,verifyOtp,resendOtp}=require("../controllers/userController");
const {protect} = require("../middleware/authMiddleware")

router.post("/register",register);
router.post("/login",login);
router.get("/me",protect,getCurrentUser);
router.put("/update",protect,updateUser);
router.put("/updateprofile",protect,updateProfile)
router.post("/verify-otp",protect,verifyOtp)
router.post("/send-otp",protect,resendOtp)

module.exports = router;