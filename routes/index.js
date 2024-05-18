var express = require('express');
var router = express.Router();
var adminRouter = require('./admin')
var categoryRouter = require('./categories');
var subCategoryRouter = require('./subCategory');
var productRouter = require('./product');
const { isAuth } = require('../middleware/imageUpload');

/* GET home page. */
router.use('/', adminRouter);
router.use('/category',isAuth,categoryRouter);
router.use('/sub-category',isAuth,subCategoryRouter);
router.use('/product',isAuth,productRouter);

module.exports = router;
