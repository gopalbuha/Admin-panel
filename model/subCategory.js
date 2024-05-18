var { v4: uuid } = require("uuid");
var mongoose = require("mongoose");

const options = {
    timestamps: true,
};


const subCategoriesModel = new mongoose.Schema({
    id: {
        type: String,
        default: uuid,
        unique: true,
    },
    category: {
        type: String,
    },
    subCategory:{
        type: String,
    },
}, options);

var subCategories = new mongoose.model("subCategories", subCategoriesModel);

module.exports = {
    subCategories: subCategories,
}