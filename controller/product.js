const { categories } = require("../model/categories.js");
// const { productImage } = require("../model/productImageModel.js");
const { product } = require("../model/product.js");
const subCategory = require("../model/subCategory.js");
const { subCategories } = require("../model/subCategory.js");
var fs = require('fs');

//product form and catagory,subcateegory data view...
var productForm = async (req, res) => {
    try {
        var categoryList = await categories.find().lean();
        var subCategoryList = await subCategories.find().lean();
        return res.render('producteForm', { layout: 'newmain', categories: categoryList, subCategoryList });

    } catch (e) {
        console.log(e);
    };
};

//add product form throw submit .......
var productAdd = async (req, res) => {
    try {
        var { name, subcategory, price, discount } = req.body;
        var ImageArr = [];
        var thumbnailArr = [];
        var uploadImage = req.files;
        for (let i = 0; i < uploadImage.length; i++) {
            var element = uploadImage[i];
            if (element.fieldname == 'Image') {
                thumbnailArr.push(element.filename)
            };
            if (element.fieldname == 'file[]') {
                ImageArr.push(
                    element.filename
                );
            }
        };

        var data = {
            name: name,
            category: category,
            subcategory: subcategory,
            price: price,
            discount: discount,
            image: ImageArr,
            thumbnail: thumbnailArr[0]
        }
        var postProduct = new product(data);
        var saveProduct = await postProduct.save();
        saveProduct.set('image', process.env.IMAGE_URL + postProduct.image);
            return res.send({ 
                status: true,
                message: 'Product added successfully',
                data: saveProduct,})
    } catch (e) {
        console.log(e);
    }
};


//product data get in table........
var getProduct = async (req, res) => {
    try {
        var ImageArr = [];
        var pipeline = [];

        pipeline.push({
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "id",
                as: "categoryDetails",
            }
        }, { $unwind: "$categoryDetails" });

        pipeline.push({
            $project: {
                name: '$name',
                // category:"$category",
                price: "$price",
                image: "$image",
                thumbnail: "$thumbnail",
                id: "$id",
                Category: "$categoryDetails.Category"
            }
        });

        var productData = await product.aggregate(pipeline);
        productData.forEach(element => {
            var dataArr = {
                "id": element.id ?? "",
                "name": element.name ?? "",
                "category": element.category ?? "",
                "price": element.price ?? "",
                "discount": element.discount ?? 0,
                "images": element.image[0] ?? "",
            };
            ImageArr.push(dataArr);
        });
        return res.render('productView', { title: 'product view', layout: 'newmain', productData, ImageArr });

    } catch (e) {
        console.log(e);
    }
}


var updateProduct = async (req, res) => {
    try {
        var imageArr = [];
        var prodductOldData = await product.findOne({ id: req.params.id }).lean();
        for (let i = 0; i < prodductOldData.image.length; i++) {
            const element = prodductOldData.image[i];
            imageArr.push(element)
        }

        var categoryOneData = await categories.findOne({ id: prodductOldData.category }).lean();
        //    console.log(categoryOneData,"categoryOneData");
        var subCategoryEdit = await subCategories.findOne({ id: prodductOldData.subcategory }).lean();

        var listCategory = await categories.find().lean();
        var subCategoryList = await subCategories.find().lean();
        var productImageData = await productImage.find({ productId: req.params.id }).lean();
        // console.log(productImageData, "productImage");

        return res.render('productUpdate', {
            title: 'product view', layout: 'newmain',
            prodductOldData, categoryOneData, listCategory, subCategoryEdit, subCategoryList, productImageData, imageArr
        });

    } catch (e) {
        console.log(e);
    }
}


var updateProductsDetail = async (req, res) => {
    try {
        var productdetail = await product.findOne({ id: req.params.id }).lean();

        var ImageArr = [];
        var thumbnailArr = [];

        if (req.files != '') {
            console.log(req.files, "files");
            const uploadImage = req.files;
            for (let i = 0; i < uploadImage.length; i++) {
                var element = uploadImage[i];

                if (element.fieldname == 'Image') {
                    thumbnailArr.push(element.filename);
                }

                if (element.fieldname == 'file[]') {
                    ImageArr.push(
                        element.filename
                    );
                }
            };

            var producteData = await product.updateOne({ id: req.params.id }, {
                $set: {
                    name: req.body.name,
                    category: req.body.category,
                    price: req.body.price,
                    discount: req.body.discount,
                    thumbnail: thumbnailArr[0],
                    image: ImageArr
                }
            }, { new: true });

            // if (productdetail.image.length >= 0) {
            //     var filePath = productdetail.image;
            //     for (var i = 0; i < filePath.length; i++)   {
            //         var ele = filePath[i];
            //          console.log(ele,"ele");
            //         fs.unlinkSync('./public/images/' + ele)
            //     }

            // }

            if (req.files.fieldname == 'Image') {
                console.log(req.filesm, "field");
                if (req.files != '') {
                    var filepath = productdetail.thumbnail;
                    fs.unlinkSync('./public/images/' + filepath)
                }
            }

        } else {
            await product.updateOne({ id: req.params.id }, {
                $set: {
                    name: req.body.name,
                    category: req.body.category,
                    price: req.body.price,
                    discount: req.body.discount,
                }
            }, { new: true });
        };
        var response = {
            status: true,
            message: "Product Updated Successfully",
            type: "success",
            redirect: "/productView"
        }
        res.json(response);

        return res.render('productUpdate', { title: 'product view', layout: 'newmain', })

    } catch (e) {
        console.log(e);
    }
};

var productDelete = async (req, res) => {
    try {
        var productDeleteData = await product.findOneAndDelete({ id: req.params.id });
        // console.log(productDeleteData, "productDeleteData");
        var response = {
            status: true,
            statusCode: 200,
            message: "product deleted successfully",
            type: "success",
            redirect: "/productView"
        };
        return res.json(response)

    } catch (e) {
        console.log(e);
    }
}


module.exports = {
    productForm: productForm,
    productAdd: productAdd,
    getProduct: getProduct,
    updateProduct: updateProduct,
    updateProductsDetail: updateProductsDetail,
    productDelete: productDelete,
}