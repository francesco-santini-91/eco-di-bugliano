var express = require('express');
var router = express.Router();
var loginController = require('../controllers/loginController');

router.get('/', loginController.loginPage_GET);

router.post('/', loginController.loginPage_POST);

router.post('/verify', loginController.verifyAuthentication_POST);

module.exports = router;
