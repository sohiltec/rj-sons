require("dotenv").config();
const express = require('express');
const config = require("../config");
const router = express.Router();
const mongoose = require('mongoose');

const customerSchema = require('../models/customer.model');

router.post('/customer_register', async function(req, res, next){
    const{ name, mobileNo, emailId, GSTNo, address, lat, long } = req.body;
    try {
        var existCustomer1 = await customerSchema.find({ mobileNo: mobileNo });
        if(existCustomer1.length == 1){
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Customer Already Registered !"});
        }else{
            var existCustomer = await new customerSchema({
                name: name,
                mobileNo: mobileNo,
                emailId: emailId,
                GSTNo: GSTNo,
                address: {
                    address: address,
                    lat: lat,
                    long: long
                }
            });
            if(existCustomer != null){
                existCustomer.save();
                res.status(200).json({ IsSuccess: true, Data: existCustomer, Message: "Customer Registered !"});
            }
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/updateCustomer', async function(req, res, next) {
    const{ customerId, emailId, address, lat, long } = req.body;
    try {
        var existCustomer = await customerSchema.find({ _id: customerId });
        if(existCustomer.length == 1){
            let updateIs = {
                emailId: emailId,
                address: {
                    address: address,
                    lat: lat,
                    long: long
                }
            }
            var updateCustomerIs = await customerSchema.findByIdAndUpdate(existCustomer[0]._id,updateIs);
            res.status(200).json({ IsSuccss: true, Data: 1, Message: "Data Updated"});
        }else{
            res.status(200).json({ IsSuccss: true, Data: 0, Message: "Data Not Updated"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccss: false , Message: error.message });
    }
});

router.post('/getCustomer', async function(req, res, next){
    const{ mobileNo } = req.body;
    try {
        var existCustomer = await customerSchema.find({ mobileNo: mobileNo });
        if(existCustomer.length > 0){
            res.status(200).json({ IsSuccess: true, Data: existCustomer, Message: "Data Found"});
        }else{
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/getAllCustomer', async function(req, res, next){
    try {
        var existCustomer = await customerSchema.find();
        if(existCustomer.length > 0){
            res.status(200).json({ IsSuccess: true, total: existCustomer.length, Data: existCustomer, Message: "Data Found"});
        }else{
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/deleteCustomer', async function(req, res, next){
    const { customerId } = req.body;
    try {
        var existCustomer = await customerSchema.findByIdAndDelete(customerId);
        if(existCustomer){
            res.status(200).json({ IsSuccess: true, Data: 1, Message: "Delete Successfully!" });
        }else{
            res.status(200).json({ IsSuccess: true, Data: 0, Message: "Delete Failed!" });
        }
        
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});
module.exports = router;