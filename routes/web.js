const express = require('express');
const router = express.Router();
const ViewController = require('../controllers/viewController');

// Định tuyến phục vụ giao diện Single Page App chính
router.get('*', ViewController.renderHome);

module.exports = router;
