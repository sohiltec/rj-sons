require("dotenv").config();
const express = require('express');
const config = require("../config");
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const employeeSchema = require('../models/employee.model');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/employeeProof');
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

var upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 5},
    fileFilter: fileFilter
});

// -----------------------EMPLOYEE API---------Sohil----25-02-2021
router.post('/employee_register', upload.single('proofImage'), async function(req, res, next){
    const {name, mobileNo, emailId, proofType, vehicleType, vehicleNo, IFSCCode, Bank, AcNo, branch, isVerified, isActive} = req.body;
    var fileinfo = req.file;
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
                proofImage: fileinfo == undefined ? " " : fileinfo.path,
                empId: empIdCode(),  
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

router.post('/updateEmployee', upload.single('proofImage'), async function(req, res, next){
    const {employeeId, name, emailId, proofType, vehicleType, vehicleNo, IFSCCode, Bank, AcNo, branch, isVerified, isActive} = req.body;
    var fileinfo = req.file;
    try {
            var existEmployee = await employeeSchema.findByIdAndUpdate(employeeId, {
                name: name,
                emailId: emailId,
                proofType: proofType,
                proofImage: fileinfo == undefined ? " " : fileinfo.path,
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

module.exports = router;