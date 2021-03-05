require("dotenv").config();
const express = require('express');
const config = require("../config");
const router = express.Router();
const mongoose = require('mongoose');

const adminSchema = require('../models/admin.model');
const vendorSchema = require('../models/vendor.model');
const employeeSchema = require('../models/employee.model'); 

router.post('/signup', async function(req, res, next){
    const{ name, username, password } = req.body;
    try {
        var existAdmin = await adminSchema.find({
            username: username.toLowerCase()
        });
        if(existAdmin.length == 1){
            res.status(200).json({ IsSuccess: true, Data: 0, Message: "username is already taken!"});
        }else{
            var newAdmin = await new adminSchema({
                name: name.toLowerCase(),
                username: username.toLowerCase(),
                password: password.toLowerCase()
            });
            if(newAdmin != null){
                newAdmin.save();
                res.status(200).json({ IsSuccess: true, Data: newAdmin, Message: "Admin Registered!"});
            }
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/login', async function(req, res, next){
    const{ username, password } = req.body;
    try {
        var existAdmin = await adminSchema.find({
            username: username,
            password: password
        });
        if(existAdmin.length == 1){
            res.status(200).json({ IsSuccess: true, Data: existAdmin, Message: "Login Successfully!"});
        }else{
            res.status(200).json({ IsSuccess: true, Data: existAdmin, Message: "User Not Found!"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/getAdmin', async function(req, res, next){
    try {
        var existAdmin = await adminSchema.find();
        if(existAdmin.length != 0){
            res.status(200).json({ IsSuccess: true, Data: existAdmin, Message: "Data Found!"});
        }else{
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found!"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
})
// DashCounter API------------------------
router.post('/dashcounters', async function(req, res, next){
    try {
        let vendors = await vendorSchema.countDocuments();
        let employees = await employeeSchema.countDocuments();

        res.status(200).json({ IsSuccess: true,
                                vendors: vendors,
                                employees: employees,
                                Message: "Data Found!"});
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

module.exports = router;