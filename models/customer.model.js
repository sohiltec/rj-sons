var mongoose = require('mongoose');
var customerSchema = mongoose.Schema({

    name: {
        type: String
    },
    mobileNo: {
        type: String
    },
    emailId: {
        type: String
    },
    address: {
        address: {
            type: String
        },
        lat: {
            type: String
        },
        long: {
            type: String
        }
    }
});

module.exports = mongoose.model("Customers", customerSchema);