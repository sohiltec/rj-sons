var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({

    vendorId: {
        type: mongoose.Types.ObjectId,
        ref: "Vendors"
    },
    quantity: {
        type: Number
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
    statusId: {
        type: mongoose.Types.ObjectId,
        ref: "Status"
    },
    employeeId: {
        type: mongoose.Types.ObjectId,
        ref: "Employees"
    },
    orderContent: [
        {
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "Products"
            },
            productQty: {
                type: Number
            }
        }
    ],
    note: {
        type: String
    }
});

module.exports = mongoose.model('Orders', orderSchema);