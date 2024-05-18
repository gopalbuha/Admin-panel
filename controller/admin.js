const { addmin } = require("../model/admin");
const bcrypt = require("bcrypt");

var loginPage = async (req,res) => {
    try{
        return res.render('login', { title: 'Login' });
    }catch(err){
        console.log(err);
    }
};

var loginData = async (req, res) => {
    try {
        var { email, password } = req.body
        const findUser = await addmin.findOne({ email }).lean();
        console.log(findUser,"findUser");
        if (findUser) {
            if (findUser.role == 'admin') {
                var enterpass = password;
                var stroredPass = findUser.password
                var matchPassword = await bcrypt.compare(enterpass, stroredPass);
                if (matchPassword) {
                    req.session.isAuth = true;
                    req.session.user = {
                        userId: findUser.id,
                        name: findUser.name,
                        city: findUser.city,
                        email: findUser.email,
                        phone: findUser.phone,
                        role: findUser.role,
                        image: findUser.image
                    };
                    return res.send({
                        status: true,
                        message: 'Login successfully',
                    });

                } else {
                    return res.render('login', { title: 'error', message: 'password is wrong' })
                    // return res.send({ status: false, message: 'password is wrong' })
                }
            } else {
                return res.render('login', { status: false, emailError: 'Only admin can login' })
            }
        } else {
            // res.redirect('/login')
            return res.render('login', { status: false, UserErr: 'Email is wrong' })
        };
    } catch (e) {
        console.log(e)
    }
};

var registerForm = async (req, res) => {
    try {
        return res.render('registerForm', { title: 'user Register', });

    } catch (e) {
        console.log(e);
    }
};

var add = async (req, res) => {
    try {
        console.log(req.body,"body");
        var viewAlldata = await addmin.findOne({ email: req.body.email }).lean()
        if (viewAlldata) {
            return res.send({ status: false, message: 'email already exists', })
        };

        var images = req.file?.filename;
        console.log(images,"images");
        // console.log(images, "images");
        // var Otp = generateOTP(4)
        // console.log(req.file,"images");
        var data = {
            name: req.body.name,
            city: req.body.city,
            password: req.body.password,
            email: req.body.email,
            phone: req.body.phone,
            image: images,
            role: req.body.role,
        };


        // let transport = nodemailer.createTransport({
        //     host: "smtp.mailtrap.io",
        //     port: 2525,
        //     auth: {
        //         user: process.env.MAIL_USERNAME,
        //         pass: process.env.MAIL_PASSWORD
        //     }
        // });

        // var mailSendUser = {
        //     from: process.env.MAIL_USERNAME,
        //     to: req.body.email,
        //     subject: 'otp sent',
        //     text: Otp
        // };
        // transport.sendMail(mailSendUser, function (error, info) {
        //     res.status(200)
        //     return res.send({
        //         status: true,
        //         message: " OTP sent successfully",
        //         data: {}
        //     })

        // });
        var registerUser = new addmin(data);
        var datasave = await registerUser.save();
        //    res.render('registerForm',{ title: 'User Register Success', })
        return res.send({ status: true, message: 'addmin add successfully', data: datasave });
    } catch (e) {
        console.log(e);
    }
};

var logout = async (req, res) => {
    try {
        var user = req.session.user
        req.session.destroy();
        return res.redirect('/login');
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    loginPage : loginPage,
    loginData : loginData,
    registerForm : registerForm,
    add : add,
    logout : logout
}