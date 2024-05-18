var { v4: uuid } = require("uuid");
var mongoose = require("mongoose");

const options = {
    timestamps: true,
};
const productTable = new mongoose.Schema({
    id: {
        type: String,
        default: uuid,
        unique: true,
    },
    name: {
        type: String
    },
    category: {
        type: String,
    },
    subcategory: {
        type: String,
    },
    image: [String],
    thumbnail: {
        type: String
    },
    price: {
        type: Number,
        default: 0,
    },
    // discount: {
    //     type: Number,
    //     default: 0,
    // }
}, options)

var product = new mongoose.model("product", productTable);

module.exports = {
    product: product,
};