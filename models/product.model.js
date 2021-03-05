var mongoose = require('mongoose');
var productSchema = mongoose.Schema({

    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: "Category"
    },
    brandId: {
        type: mongoose.Types.ObjectId,
        ref: "Brands"
    },
    name: {
        type: String
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    productImage: {
        type: String
    }
});

module.exports = mongoose.model("Products", productSchema);