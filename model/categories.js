var { v4: uuid } = require("uuid");
var mongoose = require("mongoose");

const options = {
    timestamps: true,
};


const categoriesAdd = new mongoose.Schema({
    id: {
        type: String,
        default: uuid,
        unique: true,
    },
    category: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, options);

var categories = new mongoose.model("categories", categoriesAdd);

module.exports = {
    categories: categories,
}