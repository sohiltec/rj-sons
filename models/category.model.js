var mongoose = require('mongoose');
var categorySchema = mongoose.Schema({

    brandId: {
        type: mongoose.Types.ObjectId,
        ref: "Brands"
    },
    name: {
        type: String
    },
    categoryImage: {
        type: String
    }
});

module.exports = mongoose.model("Category", categorySchema);