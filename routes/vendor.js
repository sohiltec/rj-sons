require("dotenv").config();
const express = require('express');
const config = require("../config");
const router = express.Router();
const mongoose = require('mongoose');

const vendorSchema = require('../models/vendor.model');

// -----------------------VENDOR API---------Sohil----25-02-2021
router.post('/vendor_register', async function(req, res, next){
    const {name, mobileNo, emailId, type, whatsappNo, GSTNo, companyName, address, area, lat, long, password, fcmToken, isVerified, isActive } = req.body;
    try {
        var vendordata1 = await vendorSchema.find({ mobileNo: mobileNo });
        if(vendordata1.length == 1){
            res.status(200).json({ IsSuccss: true, Data: [], Message: "Vendor Already Registered !"});
        }else{
            var vendordata = await new vendorSchema({
                name: name,
                mobileNo: mobileNo,
                emailId: emailId,
                type: type,
                whatsappNo: whatsappNo,
                GSTNo: GSTNo,
                companyName: companyName,
                address: {
                    address: address,
                    area: area,
                    lat: lat,
                    long: long,
                },
                password: password,
                fcmToken: fcmToken,
                isVerified: isVerified,
                isActive: isActive
            });
            if(vendordata != null){
                vendordata.save();
                res.status(200).json({ IsSuccss: true, Data: vendordata, Message: "Vendor Register"});
            }
        }
    } catch (error) {
        res.status(500).json({ IsSuccss: false , Message: error.message });
    }
});

router.post('/updateVendor', async function(req, res, next){
    const {vendorId, name, emailId, type, whatsappNo, GSTNo, companyName, address, area, lat, long, password, isActive, isVerified } = req.body;
    try {
            var existVendor = await vendorSchema.findByIdAndUpdate(vendorId, {
                name: name,
                emailId: emailId,
                type: type,
                whatsappNo: whatsappNo,
                GSTNo: GSTNo,
                companyName: companyName,
                address: {
                    address: address,
                    area: area,
                    lat: lat,
                    long: long,
                },
                password: password,
                isVerified: isVerified,
                isActive: isActive
            });
            
            if(existVendor != null){
                res.status(200).json({ IsSuccess: true, Data: 1, Message: "Vendor Updated"});
            }else{
                res.status(200).json({ IsSuccess: true, Data: [], Message: "Vendor Not Updated"});
            }
        
    } catch (error) {
        res.status(500).json({ IsSuccss: false , Message: error.message });
    }
});

router.post('/deleteVendor', async function(req, res, next){
    const { vendorId } = req.body;
    try {
        var existVendor = await vendorSchema.findByIdAndDelete(vendorId);
        if(existVendor){
            res.status(200).json({ IsSuccess: true, Data: 1, Message: "Delete Successfully!" });
        }else{
            res.status(200).json({ IsSuccess: true, Data: 0, Message: "Delete Failed!" });
        }
        
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/getVendor', async function(req, res, next){
    const{ mobileNo } = req.body;
    try {
        var existVendor = await vendorSchema.find({ mobileNo: mobileNo });
        console.log(existVendor);
        if(existVendor.length > 0){
            res.status(200).json({ IsSuccess: true, Data: existVendor, Message: "Data Found"});
        }else{
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/getAllVendor', async function(req, res, next){
    try {
        var existVendor = await vendorSchema.find();
        if(existVendor.length > 0){
            res.status(200).json({ IsSuccess: true, total: existVendor.length, Data: existVendor, Message: "Data Found"});
        }else{
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

module.exports = router;