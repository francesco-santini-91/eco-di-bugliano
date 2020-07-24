var express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articlesController');

router.get('/', articlesController.getArticlesList_GET);

router.get('/count', articlesController.getArticlesCount)

router.get('/:title', articlesController.getArticle_GET);

router.get('/category/:category', articlesController.getArticlesListByCategory_GET);

router.get('/newArticle', articlesController.createArticle_GET);

router.post('/newArticle', articlesController.createArticle_POST);

router.put('/:title', articlesController.editArticle);

router.post('/:title', articlesController.likeToArticle);

router.patch('/:title', articlesController.deleteArticle);


module.exports = router;