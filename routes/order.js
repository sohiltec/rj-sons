require("dotenv").config();
const express = require('express');
const config = require("../config");
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

const orderSchema = require('../models/order.model');

router.post('/addOrder', async function(req, res, next){
    const{vendorId, quantity, amount, discount, finalAmount, status, employeeId, productId, productQty, note} = req.body;
    let dateTimeIs = moment().format('DD/MM/YYYY,h:mm:ss a').split(',');
    let dateIs = dateTimeIs[0];
    let timeIs = dateTimeIs[1];
    try {
        var existOrder = await new orderSchema({
            vendorId: vendorId,
            quantity: quantity,
            amount: amount,
            discount: discount,
            finalAmount: finalAmount,
            orderDate: dateIs,
            orderTime: timeIs,
            status: status,
            employeeId: employeeId,
            orderContent: {
                productId: productId,
                productQty: productQty
            },
            note: note
        });
        if(existOrder != null){
            existOrder.save();
            res.status(200).json({ IsSuccss: true, Data: existOrder, Message: "Order Registered"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccss: false , Message: error.message });
    }
});

router.post('/updateOrder', async function(req, res, next){
    const{orderId, quantity, amount, discount, finalAmount, status, productId, productQty, note} = req.body;
    let dateTimeIs = moment().format('DD/MM/YYYY,h:mm:ss a').split(',');
    let dateIs = dateTimeIs[0];
    let timeIs = dateTimeIs[1];
    try {
        var existOrder = await orderSchema.find({ _id: orderId});
        if(existOrder.length == 1){
            let updateIs = {
                quantity: quantity,
                amount: amount,
                discount: discount,
                finalAmount: finalAmount,
                orderDate: dateIs,
                orderTime: timeIs,
                status: status,
                orderContent: {
                        productId: productId,
                        productQty: productQty
                },
                note: note
            }
            var updateOrderIs = await orderSchema.findByIdAndUpdate(existOrder[0]._id, updateIs);
            res.status(200).json({ IsSuccss: true, Data: 1, Message: "Data Updated"});
        }else{
            res.status(200).json({ IsSuccss: true, Data: 0, Message: "Order Not Updated"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccss: false , Message: error.message });
    }
});

router.post('/getOrder', async function(req, res, next){
    const{ orderId } = req.body;
    try {
        var existOrder = await orderSchema.findById(orderId);
        if(existOrder){
            res.status(200).json({ IsSuccess: true, Data: existOrder, Message: "Data Found"});
        }else{
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/getAllOrder', async function(req, res, next){
    try {
        var existOrder = await orderSchema.find();
        if(existOrder.length > 0){
            res.status(200).json({ IsSuccess: true, total: existOrder.length, Data: existOrder, Message: "Data Found"});
        }else{
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/deleteOrder', async function(req, res, next){
    const{ orderId } = req.body;
    try {
        var existOrder = await orderSchema.findByIdAndDelete(orderId);
        if(existOrder){
            res.status(200).json({ IsSuccess: true, Data: 1, Message: "Delete Successfully"});
        }else{
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Delete Failed"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

module.exports = router;