require("dotenv").config();
const express = require('express');
const config = require("../config");
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

var brandSchema = require('../models/brand.model');
var categorySchema = require('../models/category.model');

var brandImage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/brandImage');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});

var fileFilter = (req, file, cb) => {
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

var uploadBrand = multer({
    storage: brandImage,
    limits: {fileSize: 1024 * 1024 * 5},
    fileFilter: fileFilter
});

var categoryImage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/categoryImage');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '_' + file.originalname);
    }
});

var uploadcategory = multer({
    storage: categoryImage,
    limits: {fileSize: 1024 * 1024 * 5},
    fileFilter: fileFilter
});

router.post('/brand_register', uploadBrand.single('brandProfileImage'), async function(req, res, next){
    const{ brandName, brandMobile, brandEmail } = req.body;
    var fileinfo = req.file;
    try {
        var brandData = await brandSchema.find({ brandMobile: brandMobile });
        if(brandData.length == 1){
            res.status(200).json({ IsSuccss: true, Data: [], Message: "MobileNo. Already Registered !"});
        }else{
            var existBrand = await new brandSchema({
                brandName: brandName,
                brandMobile: brandMobile,
                brandEmail: brandEmail,
                brandProfileImage: fileinfo == undefined ? " " : fileinfo.path
            });
            if(existBrand != null){
                existBrand.save();
                res.status(200).json({ IsSuccss: true, Data: existBrand, Message: "Brand Registered !"});
            }
        }
    } catch (error) {
        res.status(500).json({ IsSuccss: false , Message: error.message });
    }
});

router.post('/updateBrand', uploadBrand.single('brandProfileImage'), async function(req, res, next) {
    const{ brandId, brandName, brandEmail } = req.body;
    var fileinfo = req.file;
    try {
        var existBrand = await brandSchema.find({ _id: brandId });
        if(existBrand.length == 1){
            let updateIs = {
                brandName: brandName,
                brandEmail: brandEmail,
                brandProfileImage: fileinfo == undefined ? " " : fileinfo.path
            }
            var updateBrandIs = await brandSchema.findByIdAndUpdate(existBrand[0]._id,updateIs);
            res.status(200).json({ IsSuccss: true, Data: 1, Message: "Data Updated"});
        }else{
            res.status(200).json({ IsSuccss: true, Data: 0, Message: "Data Not Updated"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccss: false , Message: error.message });
    }
});

router.post('/deleteBrand', async function(req, res, next){
    const { brandId } = req.body;
    try {
        var existBrand = await brandSchema.findByIdAndDelete(brandId);
        if(existBrand){
            res.status(200).json({ IsSuccess: true, Data: 1, Message: "Delete Successfully!" });
        }else{
            res.status(200).json({ IsSuccess: true, Data: 0, Message: "Delete Failed!" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/getBrand', async function(req, res, next){
    const{ brandMobile } = req.body;
    try {
        var existBrand = await brandSchema.find({ brandMobile: brandMobile });
        if(existBrand.length > 0){
            res.status(200).json({ IsSuccess: true, Data: existBrand, Message: "Data Found"});
        }else{
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/getAllBrand', async function(req, res, next){
    try {
        var existBrand = await brandSchema.find();
        if(existBrand.length > 0){
            res.status(200).json({ IsSuccess: true, total: existBrand.length, Data: existBrand, Message: "Data Found"});
        }else{
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/addCategory', uploadcategory.single('categoryImage'), async function(req, res, next) {
    const{ brandId, name } = req.body;
    var fileinfo = req.file;
    try {
        var existCategory = await new categorySchema({
            brandId: brandId,
            name: name,
            categoryImage: fileinfo == undefined ? " " : fileinfo.path
        });
        if(existCategory != null){
            existCategory.save();
            res.status(200).json({ IsSuccss: true, Data: existCategory, Message: "Category Registered !"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/updateCategory', uploadcategory.single('categoryImage'), async function(req, res, next){
    const{ categoryId, name } = req.body;
    var fileinfo = req.file;
    try {
        var existCategory = await categorySchema.find({ _id: categoryId });
        if(existCategory.length == 1){
            let updateIs = {
                name: name,
                categoryImage: fileinfo == undefined ? " " : fileinfo.path
            }
            var updateCategoryIs = await categorySchema.findByIdAndUpdate(existCategory[0]._id, updateIs);
            res.status(200).json({ IsSuccss: true, Data: 1, Message: "Data Updated"});
        }else{
            res.status(200).json({ IsSuccss: true, Data: 0, Message: "Data Not Updated"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/deleteCategory', async function(req, res, next){
    const { categoryId } = req.body;
    try {
        var existCategory = await categorySchema.findByIdAndDelete(categoryId);
        if(existCategory){
            res.status(200).json({ IsSuccess: true, Data: 1, Message: "Delete Successfully!" });
        }else{
            res.status(200).json({ IsSuccess: true, Data: 0, Message: "Delete Failed!" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/getAllCategory', async function(req, res, next){
    try {
        var existCategory = await categorySchema.find();
        if(existCategory.length > 0){
            res.status(200).json({ IsSuccess: true, total: existCategory.length, Data: existCategory, Message: "Data Found"});
        }else{
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

module.exports = router;