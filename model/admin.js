var { v4: uuid } = require("uuid");
var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const options = {
    timestamps: true,
};

const admin = new mongoose.Schema({
    id: {
        type: String,
        default: uuid,
        unique: true,
    },
    name: {
        type: String,
        default: " ",
    },
    city: {
        type: String,
    },
    email: {
        type: String,
        // required: true,
        unique: true,
    },
    password: {
        type: String,
        // required: true,
    },
    phone: {
        type: Number,
        // required: true,
    },
    image: {
        type: String,
    },
    otp:{
        type:String,
        uniqeu: true
    },
    isVerify:{
        type:Boolean,
        default: false,
    },
    role:{
        type:String,
        default:"admin"
    }
}, options);

admin.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

var addmin = new mongoose.model("addmin", admin);

module.exports = {
    addmin: addmin,
}