const multer = require('multer');

const imageupload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "public/images")
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '_' + file.originalname )
        }
    })    
}) ;

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        return res.redirect('/login')
    }

}

   
module.exports = {   
    imageupload: imageupload,
    isAuth : isAuth
}