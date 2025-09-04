const express = require("express");
const router = express.Router();
const {register,login,getCurrentUser, updateUser}=require("../controllers/userController");
const {protect} = require("../middleware/authMiddleware")

router.post("/register",register);
router.post("/login",login);
router.get("/me",protect,getCurrentUser);
router.put("/update",protect,updateUser);

module.exports = router;