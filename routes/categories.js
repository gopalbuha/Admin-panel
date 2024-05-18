var express = require('express');
const { categoriesForm, addCategories, vieCategory, catagoryUpdate, postCategoryUpdate, deleteCategory } = require('../controller/categories');
var router = express.Router();

/* GET home page. */

router.get('/', categoriesForm);
router.post('/add', addCategories);
router.get('/list', vieCategory);
router.get('/update/:id', catagoryUpdate);
router.post('/update-record', postCategoryUpdate);
router.get('/delete/:id', deleteCategory);

module.exports = router;