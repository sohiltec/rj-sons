var mongoose = require('mongoose');
var employeeSchema = mongoose.Schema({

    name: {
        type: String
    },
    mobileNo: {
        type: String
    },
    emailId: {
        type: String
    },
    proofType: {
        type: String
    },
    proofImage: {
        type: String
    },
    empId: {
        type: String
    },
    fcmToken: {
        type: String,
        default: ""
    },
    transport: {
        vehicleType: {
            type: String
        },
        vehicleNo: {
            type: String
        }
    },
    bankDetails: {
        IFSCCode: {
            type: String
        },
        Bank: {
            type: String
        },
        AcNo: {
            type: String
        },
        branch: {
            type: String
        }
    },
    isVerified: {
        type: Boolean
    },
    isActive: {
        type: Boolean
    },
});

module.exports = mongoose.model("Employees", employeeSchema);