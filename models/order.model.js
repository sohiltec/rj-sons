var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({

    vendorId: {
        type: mongoose.Types.ObjectId,
        ref: "Vendors"
    },
    quantity: {
        type: String
    },
    amount: {
        type: Number
    },
    discount: {
        type: Number
    },
    finalAmount: {
        type: Number
    },
    orderDate: {
        type: String,
        default: ''
    },
    orderTime: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        required: true
    },
    employeeId: {
        type: mongoose.Types.ObjectId,
        ref: "Employees"
    },
    orderContent: {
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "Products"
        },
        productQty: {
            type: String
        }
    },
    note: {
        type: String
    }
});

module.exports = mongoose.model('Orders', orderSchema);