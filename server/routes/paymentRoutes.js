const express = require("express");
const router = express.Router();
const {createOrder,verifyPaymentAndUnlock} = require("../controllers/paymentController");
const {protect} = require("../middleware/authMiddleware");

router.post('/order',protect,createOrder);
router.post('/verify',protect,verifyPaymentAndUnlock);

module.exports = router;