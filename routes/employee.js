require("dotenv").config();
const path = require('path');
const express = require('express');
const config = require("../config");
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const employeeSchema = require('../models/employee.model');
const prooftypeSchema = require('../models/prooftype.model');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/employeeProof');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 5}
});
var fieldset = upload.fields([
    { name: "proofFrontImg", maxCount: 1 },
    { name: "proofBackImg", maxCount: 1 },
    { name: "panCardImg", maxCount: 1 },
]);

function empIdCode() {
    var result = "";
    var number = Math.floor(1000 + Math.random() * 9000);
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var charLength = characters.length;
    for(var i = 0; i < 4; i++){
        result += characters.charAt(Math.floor(Math.random() * charLength));
    }
    var finalResult = result + number;
    console.log(finalResult);
    return finalResult;
}

router.post('/masterData', async function(req, res, next){
    try {
        var proofType = await prooftypeSchema.find();
        if(proofType){
            res.status(200).json({ IsSuccess: true, proofType: proofType, Message: "Data Found" });
        }else{
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found" });
        }    
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/employee_register', fieldset, async function(req, res, next){
    const {name, mobileNo, emailId, proofType, fcmToken, vehicleType, vehicleNo, IFSCCode, Bank, AcNo, branch, isVerified, isActive} = req.body;
    var fileinfo = req.files;
    try {
        var employeedata1 = await employeeSchema.find({ mobileNo: mobileNo });
        if(employeedata1.length == 1){
            res.status(200).json({ IsSuccss: true, Data: [], Message: "Employee Already Registered !"});
        }else{
            var employeedata = await new employeeSchema({
                name: name,
                mobileNo: mobileNo,
                emailId: emailId,
                proofType: proofType,
                proofFrontImg: fileinfo == undefined ? " " : fileinfo.proofFrontImg[0].path,
                proofBackImg: fileinfo == undefined ? " " : fileinfo.proofBackImg[0].path,
                panCardImg: fileinfo == undefined ? " " : fileinfo.panCardImg[0].path,
                empId: empIdCode(),
                fcmToken: fcmToken,  
                transport: {
                    vehicleType: vehicleType,
                    vehicleNo: vehicleNo
                },
                bankDetails: {
                    IFSCCode: IFSCCode,
                    Bank: Bank,
                    AcNo: AcNo,
                    branch: branch
                },
                isVerified: isVerified,
                isActive: isActive
            });
            if(employeedata != null){
                employeedata.save();
                res.status(200).json({ IsSuccss: true, Data: employeedata, Message: "Employee Register"});
            }
        }
    } catch (error) {
        res.status(500).json({ IsSuccss: false , Message: error.message });
    }
});

router.post('/updateEmployee', fieldset, async function(req, res, next){
    const {employeeId, name, emailId, proofType, vehicleType, vehicleNo, IFSCCode, Bank, AcNo, branch, isVerified, isActive} = req.body;
    var fileinfo = req.files;
    try {
            var existEmployee = await employeeSchema.findByIdAndUpdate(employeeId, {
                name: name,
                emailId: emailId,
                proofType: proofType,
                proofFrontImg: fileinfo == undefined ? " " : fileinfo.proofFrontImg[0].path,
                proofBackImg: fileinfo == undefined ? " " : fileinfo.proofBackImg[0].path,
                panCardImg: fileinfo == undefined ? " " : fileinfo.panCardImg[0].path,
                transport: {
                    vehicleType: vehicleType,
                    vehicleNo: vehicleNo
                },
                bankDetails: {
                    IFSCCode: IFSCCode,
                    Bank: Bank,
                    AcNo: AcNo,
                    branch: branch
                },
                isVerified: isVerified,
                isActive: isActive
            });
            if(existEmployee != null){
                res.status(200).json({ IsSuccess: true, Data: 1, Message: "Employee Updated"});
            }else{
                res.status(200).json({ IsSuccess: true, Data: [], Message: "Employee Not Updated"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccss: false , Message: error.message });
    }
});

router.post('/deleteEmployee', async function(req, res, next){
    const { employeeId } = req.body;
    try {
        var existEmployee = await employeeSchema.findByIdAndDelete(employeeId);
        if(existEmployee){
            res.status(200).json({ IsSuccess: true, Data: 1, Message: "Delete Successfully!" });
        }else{
            res.status(200).json({ IsSuccess: true, Data: 0, Message: "Delete Failed!" });
        }
        
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/getEmployee', async function(req, res, next){
    const{ mobileNo } = req.body;
    try {
        var existEmployee = await employeeSchema.find({ mobileNo: mobileNo });
        if(existEmployee.length > 0){
            res.status(200).json({ IsSuccess: true, Data: existEmployee, Message: "Data Found"});
        }else{
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

router.post('/getAllEmployee', async function(req, res, next){
    try {
        var existEmployee = await employeeSchema.find();
        if(existEmployee.length > 0){
            res.status(200).json({ IsSuccess: true, total: existEmployee.length, Data: existEmployee, Message: "Data Found"});
        }else{
            res.status(200).json({ IsSuccess: true, Data: [], Message: "Data Not Found"});
        }
    } catch (error) {
        res.status(500).json({ IsSuccess: false, Message: error.message });
    }
});

module.exports = router;