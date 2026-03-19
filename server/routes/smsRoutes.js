const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');


router.post('/incoming', smsController.incomingSms);

module.exports = router;
