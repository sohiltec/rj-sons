var mongoose = require('mongoose');
var brandSchema = mongoose.Schema({

    brandName: {
        type: String
    },
    brandMobile: {
        type: String
    },
    brandEmail: {
        type: String
    },
    brandProfileImage: {
        type: String
    }
});

module.exports = mongoose.model("Brands", brandSchema);