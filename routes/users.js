var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController');

/* GET users listing. */
router.get('/', usersController.getUsersList_GET);

router.get('/:userId', usersController.getUserDetails_GET);

router.get('/:userId/articles', usersController.getArticlesByAuthor_GET);

router.get('/newUser', usersController.createNewUser_GET);

router.post('/newUser', usersController.createNewUser_POST);

router.put('/:userId', usersController.editUser);

router.patch('/:userId', usersController.deleteUser);


module.exports = router;
