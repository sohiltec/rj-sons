require("dotenv").config();
const express = require('express');
const config = require("../config");
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

const orderSchema = require('../models/order.model');
const statusSchema = require('../models/status.model');
const productSchema = require('../models/product.model');

// -----------------------------status-------------------2-3-2021--
router.post('/addStatus', async function(req, res, next){
    const{orderStatus} = req.body;
    try {
        var existStatus1 = await statusSchema.find({ orderStatus: orderStatus });
        if(existStatus1.length == 1){
            res.status(200).json({ IsSuccss: true, Data: existOrder, Message: "Status Already Registered"});
        }else{
            var existStatus = await new statusSchema({
                orderStatus: orderStatus
            });
            if(existStatus != null){
                existStatus.save();
                res.status(200).json({ IsSuccss: true, Data: existStatus, Message: "Status Registered"});
            }
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message});
    }
})

router.post('/addOrder', async function(req, res, next){
    const{vendorId, quantity, amount, discount, finalAmount, statusId, employeeId,orderContent ,productId, productQty, note} = req.body;
    let dateTimeIs = moment().format('DD/MM/YYYY,h:mm:ss a').split(',');
    let dateIs = dateTimeIs[0];
    let timeIs = dateTimeIs[1];
    try {
        // var existStatus = await statusSchema.findById(statusId);
        // let statusIs = existStatus.orderStatus;
        var existOrder = await new orderSchema({
            vendorId: vendorId,
            quantity: quantity,
            amount: amount,
            discount: discount,
            finalAmount: finalAmount,
            orderDate: dateIs,
            orderTime: timeIs,
            statusId: statusId,
            employeeId: employeeId,
            orderContent: orderContent,
            note: note
        });
        // console.log(existOrder);
        if(existOrder != null){
            existOrder.save();
            res.status(200).json({ IsSuccss: true, Data: existOrder, Message: "Order Registered"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccss: false , Message: error.message });
    }
});

router.post('/updateOrder', async function(req, res, next){
    const{orderId, quantity, amount, discount, finalAmount, statusId, orderContent, productId, productQty, note} = req.body;
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
                statusId: statusId,
                orderContent: orderContent,
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
        var existOrder = await orderSchema.find({_id: orderId})
                                            .populate({
                                                path: "statusId",
                                                select: "orderStatus"
                                            });
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

router.post('/orderCalc', async function(req, res, next){
    const{ orderContent, discount } = req.body;

    let totalQty = 0
    let totalAmount = 0;

    for(let i=0;i<orderContent.length;i++){
        let productIdIs = orderContent[i].productId;
        let productQtyIs = orderContent[i].productQty;
        let products = await productSchema.find({ _id: productIdIs });
        let priceIs = products[0].price;
        let totalPrice = productQtyIs * priceIs;
        totalQty += productQtyIs;
        totalAmount += totalPrice;
        // console.log(productIdIs);
        // console.log(productQtyIs);
        // console.log(priceIs);
        // console.log(totalPrice);
        // console.log(totalQty);
        // console.log(totalAmount);

    }
    let finalAmount = totalAmount - discount;

    let dataset = [{
        quantity: totalQty,
        amount: totalAmount,
        discount: discount,
        finalAmount: finalAmount,
    }];
    console.log(dataset);
    res.status(200).json({ IsSuccess: true, Data: dataset, Message: "Calculation Found"});
});


module.exports = router;