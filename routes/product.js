var express = require('express');
const { productForm, productAdd, getProduct } = require('../controller/product');
const { imageupload } = require('../middleware/imageUpload');
var router = express.Router();


/* GET home page. */
router.get('/',productForm);
router.post('/add', imageupload.any(),productAdd);
router.get('/view', imageupload.any(),getProduct);

module.exports = router;