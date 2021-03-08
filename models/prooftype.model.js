var mongoose = require('mongoose');
var prooftypeSchema = mongoose.Schema({

    title: {
        type: String
    }
});

module.exports = mongoose.model("prooftypes", prooftypeSchema);