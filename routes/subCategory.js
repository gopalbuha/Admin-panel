var express = require('express');
const { 
    subcategoryForm, 
    subCategoryAdd, 
    subCategoryList,
    subCategoryUpdate,
    subcategoryDataUpdate,
    deleteSubCategory
} = require('../controller/subCategory');
var router = express.Router();


/* GET home page. */
router.get('/',subcategoryForm);
router.post('/add',subCategoryAdd);
router.get('/list',subCategoryList);
router.get('/update/:id', subCategoryUpdate);
router.post('/edit', subcategoryDataUpdate)
router.get('/delete/:id', deleteSubCategory);


module.exports = router;