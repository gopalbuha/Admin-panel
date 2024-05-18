const {categories} = require("../model/categories");
const { subCategories } = require("../model/subCategory");



var subcategoryForm = async (req, res) => {
    try {
        var getCategory = await categories.find().lean();
        return res.render('subCategoryAdd', { layout: 'newmain', getCategory });
    } catch (e) {
        console.log(e);
        return res.send({ status:false, message: 'Internal Server Error' });
    }

}

var subCategoryAdd = async (req, res) => {
    try {
        var { category, subCategory } = req.body;
        if(category == 'undefined' || !category){
            return res.send ({
                status:false,
                message:'Please enter category',
            });
        }
        if (subCategory == 'undefined' || !subCategory) {
            return res.send ({
                status:false,
                message:'Please enter subcategory',
            });
        }
        var subCategory = new subCategories({
            category: category,
            subCategory: subCategory,
        });
         await subCategory.save();
        return res.send ({
            status: true,
            message: 'SubCategory saved successfully',
        });
    } catch (e) {
        console.log(e);
        return res.send({ status:false, message: 'Internal Server Error' });
    }
};



var subCategoryList = async (req, res) => {
    try {
        var pipeline = [];
        pipeline.push({
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "id",
                as: "categoryDetails",
            }
        }, {
            $unwind: "$categoryDetails"
        })
        var categoryData = await subCategories.aggregate(pipeline);
        return res.render('viewSubCategory', { title: 'subcategories view', layout: 'newmain', subCategories: categoryData });
    } catch (e) {
        console.log(e);
        return res.send({ status:false, message: 'Internal Server Error' });
    }
};

var subCategoryUpdate = async (req, res) => {
    try {
        var subCategoryEdit = await subCategories.findOne({ id: req.params.id }).lean();
        var categoryOneData = await categories.findOne({id:subCategoryEdit.category}).lean();
        var listCategory = await categories.find().lean();
        return res.render('updteSubCategory', { title: 'update subCategory', layout: 'newmain', subCategoryEdit,categoryOneData,listCategory });
    } catch (e) {
        console.log(e);
        return res.send({ status:false, message: 'Internal Server Error' });
    }
};

var subcategoryDataUpdate = async (req,res)=>{
    try{
        // console.log(req.body);
         console.log(req.body,"============req");
        var formData = await subCategories.findOneAndUpdate({id:req.body.id},{
            $set:{
                category: req.body.category,
                subCategory: req.body.subCategory
            }
        },
        {new: true})
        var response = {
            status: true,
            message: "Subcategory Updated Successfully",
            type: "success",
            redirect: "/sub-category/list"
          }
           return res.send(response);
        //    return res.render('updteSubCategory', { title: 'update category', layout: 'main'});
    }catch (e){
       console.log(e);
    };
};

var deleteSubCategory = async (req, res) => {
    try {
      var categoryData = await subCategories.findOneAndDelete({ id: req.params.id });
      console.log(categoryData, "categoryData");
        // return res.redirect('/viewSubCategory');
      var response = {
        status: true,
        statusCode: 200,
        message: "Category deleted successfully",
        type: "success",
        redirect: "/sub-category/list"
      };
      return res.send(response)
    } catch (e) {
      console.log(e);
    }
  }
module.exports = {
    subcategoryForm: subcategoryForm,
    subCategoryAdd: subCategoryAdd,
    subCategoryList: subCategoryList,
    subCategoryUpdate: subCategoryUpdate,
    subcategoryDataUpdate: subcategoryDataUpdate,
    deleteSubCategory: deleteSubCategory,
}