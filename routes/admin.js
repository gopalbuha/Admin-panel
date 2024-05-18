var express = require('express');
const { 
    loginPage,
    loginData,
    registerForm,
    add,
    logout,
} = require('../controller/admin');
const { imageupload } = require('../middleware/imageUpload');
var router = express.Router();

/* GET home page. */
router.get('/login', loginPage);
router.post('/login', loginData);
router.get('/', registerForm)
router.post('/adminAdd', imageupload.single('image'), add);
router.get('/logout',logout);

module.exports = router;