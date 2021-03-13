require("dotenv").config();
const express = require('express');
const config = require("../config");
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

var brandSchema = require('../models/brand.model');
var categorySchema = require('../models/category.model');
var productSchema = require('../models/product.model');

var brandImage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/brandImage');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + "_" + file.originalname);
    }
});

var uploadBrand = multer({
    storage: brandImage,
    limits: {fileSize: 1024 * 1024 * 5}
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
    limits: {fileSize: 1024 * 1024 * 5}
});

var productImage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/productImage');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '_' + file.originalname);
    }
});

var uploadProduct = multer({
    storage: productImage,
    limits: {fileSize: 1024 * 1024 * 5}
});

// -----------------------BRAND API---------Sohil----26-02-2021
router.post('/brand_register', uploadBrand.single('brandProfileImage'), async function(req, res, next){
    const{ brandName, brandMobile, brandEmail } = req.body;
    var fileinfo = req.file;
    try {
        var brandData = await brandSchema.find({ brandMobile: brandMobile, brandName: brandName });
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

// -----------------------CATEGORY API---------Sohil----26-02-2021
router.post('/addCategory', uploadcategory.single('categoryImage'), async function(req, res, next) {
    const{ brandId, name } = req.body;
    var fileinfo = req.file;
    try {
        var existCategory1 = await categorySchema.find({
            brandId: brandId,
            name: name
        });
        if(existCategory1.length == 1){
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Category Already Registered !"});
        }else{
            var existCategory = await new categorySchema({
                brandId: brandId,
                name: name,
                categoryImage: fileinfo == undefined ? " " : fileinfo.path
            });
            if(existCategory != null){
                existCategory.save();
                res.status(200).json({ IsSuccss: true, Data: existCategory, Message: "Category Registered !"});
            }
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

// -----------------------PRODUCT API---------Sohil----26-02-2021
router.post('/addProduct', uploadProduct.single('productImage'), async function(req, res, next) {
    const{ categoryId, brandId, name, price, quantity } = req.body;
    var fileinfo = req.file;
    try {
        var existProduct1 = await productSchema.find({
            categoryId: categoryId,
            brandId: brandId,
            name: name
        });
        if(existProduct1.length == 1){
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Product Already Registered !"});
        }else{
            var existProduct = await new productSchema({
                categoryId: categoryId,
                brandId: brandId,
                name: name,
                price: price,
                quantity: quantity,
                productImage: fileinfo == undefined ? " " : fileinfo.path
            });
            if(existProduct != null){
                existProduct.save();
                res.status(200).json({ IsSuccss: true, Data: existProduct, Message: "Product Registered !"});
            }
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/updateProduct', uploadProduct.single('productImage'), async function(req, res, next) {
    const{ productId, name, price, quantity } = req.body;
    var fileinfo = req.file;
    try {
        var existProduct = await productSchema.find({ _id: productId });
        if(existProduct.length == 1){
            let updateIs = {
                name: name,
                price: price,
                quantity: quantity,
                productImage: fileinfo == undefined ? " " : fileinfo.path
            }
            var updateProductIs = await productSchema.findByIdAndUpdate(existProduct[0]._id,updateIs);
            res.status(200).json({ IsSuccss: true, Data: 1, Message: "Data Updated"});
        }else{
            res.status(200).json({ IsSuccss: true, Data: 0, Message: "Data Not Updated"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccss: false , Message: error.message });
    }
});

router.post('/getAllProduct', async function(req, res, next){
    try {
        var existProduct = await productSchema.find();
        if(existProduct.length > 0){
            res.status(200).json({ IsSuccess: true, total: existProduct.length, Data: existProduct, Message: "Data Found"});
        }else{
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/deleteProduct', async function(req, res, next){
    const { productId } = req.body;
    try {
        var existProduct = await productSchema.findByIdAndDelete(productId);
        if(existProduct){
            res.status(200).json({ IsSuccess: true, Data: 1, Message: "Delete Successfully!" });
        }else{
            res.status(200).json({ IsSuccess: true, Data: 0, Message: "Delete Failed!" });
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

module.exports = router;