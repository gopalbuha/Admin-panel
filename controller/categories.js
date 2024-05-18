const { categories } = require("../model/categories");

var getDataTable = async (req, res) => {
    try {
        return res.render('dataTable', { title: 'get table', layout: 'newmain' })
    } catch (e) {
        console.log(e);
    }
}

var categoriesForm = async (req, res) => {
    try {
        return res.render('categorie', { title: 'categories', layout: 'newmain' });
    } catch (e) {
        console.log(e);
       return res.send({ status:false, message: 'Internal Server Error' });
    }
};

var addCategories = async (req, res) => {
    try {
        var { category } = req.body
        var viewCategory = await categories.findOne({ category, isActive: true }).lean();
        if (viewCategory) {
            return res.send({
                status: false,
                message: "Category already exists"
            })
        };
        const categoryData = new categories({
            category: category
        })
        await categoryData.save();
        return res.send({
            status: true,
            message: 'Category saved successfully',
        });
    } catch (e) {
        console.log(e);
        return res.send({ status:false, message: 'Internal Server Error' });
    }
};

var vieCategory = async (req, res) => {
    try {
      var listCategory = await categories.find().lean();
      return res.render('viewCategory', { title: 'categories view', layout: 'newmain', categories: listCategory });
  
    } catch (e) {
      console.log(e);
      res.send({ status:false, message: 'Internal Server Error' });
    }
  };

  var catagoryUpdate = async (req, res) => {
    try {
      var updateUser = await categories.findOne({ id: req.params.id }).lean()
      console.log(updateUser,"updateUser");
      return res.render('categoryUpdate', { title: 'update category', layout: 'newmain', updateUser });
    } catch (e) {
      console.log(e);
      return res.send({ status:false, message: 'Internal Server Error' });
    }
  }
  
  var postCategoryUpdate = async (req, res) => {
    try {
      var newCategory = await categories.findOneAndUpdate({ id: req.body.id }, {
        $set: {
          category: req.body.category
        }
      }, { new: true });
      var response = {
        status: true,
        message: "Category Updated Successfully",
        type: "success",
        redirect: "/category/list"
      }
      return res.json(response);
    } catch (e) {
      console.log(e);
      return res.send({ status:false, message: 'Internal Server Error' });
    }
  };
  
  var deleteCategory = async (req, res) => {
    try {
     await categories.findOneAndDelete({ id: req.params.id });
      var response = {
        status: true,
        statusCode: 200,
        message: "Category deleted successfully",
        type: "success",
        redirect: "/category/list"
      };
      return res.json(response);
    } catch (e) {
      console.log(e);
      return res.send({ status:false, message: 'Internal Server Error' });
    }
  }

module.exports = {
    getDataTable: getDataTable,
    categoriesForm: categoriesForm,
    addCategories: addCategories,
    vieCategory : vieCategory,
    catagoryUpdate : catagoryUpdate,
    postCategoryUpdate :postCategoryUpdate,
    deleteCategory :deleteCategory
}