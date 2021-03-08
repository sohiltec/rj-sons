var mongoose = require('mongoose');
var vendorSchema = mongoose.Schema({

    name: {
        type: String
    },
    mobileNo: {
        type: String
    },
    emailId: {
        type: String
    },
    type: {
        type: String
    },
    whatsappNo: {
        type: String
    },
    GSTNo: {
        type: String
    },
    companyName: {
        type: String
    },
    address: {
        address: {
            type: String
        },
        area: {
            type: String
        },
        lat: {
            type: String
        },
        long: {
            type: String
        }
    },
    password: {
        type: String
    },
    fcmToken: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("Vendors", vendorSchema);